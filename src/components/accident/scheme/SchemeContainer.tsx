import React from 'react';
import { SchemeData as BaseSchemeData, GeolocationData, Vehicle as BaseVehicle, Path as BasePath, Annotation as BaseAnnotation } from '../types';
import { SchemeData as TypesSchemeData, VehicleSchemeData, PathData, AnnotationData } from '../types/types';
import { useSchemeContainer } from './hooks/useSchemeContainer';
import SchemeContent from './components/SchemeContent';
import VehicleScheme from '../../VehicleScheme';

interface SchemeContainerProps {
  initialData?: BaseSchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: BaseSchemeData) => void;
  onSchemeUpdate?: (data: BaseSchemeData) => void;
  readOnly?: boolean;
  activeTab?: string;
}

// Helper functions to map between different type formats
const convertVehicle = (v: BaseVehicle): VehicleSchemeData => ({
  ...v,
  type: v.type || 'car', // Ensure type is a string (could be 'car', 'truck', 'bike', 'A', 'B', etc.)
  label: v.label || `Véhicule ${v.type || ''}`,
  x: v.x || (v.position ? v.position[0] : 0),
  y: v.y || (v.position ? v.position[1] : 0),
  width: v.width || 80,
  height: v.height || 40,
});

const convertPath = (p: BasePath): PathData => ({
  ...p,
  vehicleId: p.vehicleId || '',  // Ensure vehicleId is always present
  width: p.width || 3,
  dashArray: p.dashed ? '10, 10' : undefined,
});

const convertAnnotation = (a: BaseAnnotation): AnnotationData => ({
  ...a,
  color: a.color || '#10b981',  // Default color for annotations
});

const convertBackVehicle = (v: VehicleSchemeData): BaseVehicle => ({
  ...v,
  // Ensure type is compatible with 'car' | 'truck' | 'bike'
  type: (v.type === 'car' || v.type === 'truck' || v.type === 'bike') 
    ? v.type as 'car' | 'truck' | 'bike' 
    : 'car',
  position: [v.x || v.position[0], v.y || v.position[1]] as [number, number],
  label: v.label,
  isSelected: v.isSelected || false,
});

const convertBackPath = (p: PathData): BasePath => ({
  ...p,
  dashed: !!p.dashArray,  // Convert dashArray to boolean dashed property
  width: p.width || 3,
  isSelected: p.isSelected || false,
  vehicleId: p.vehicleId,
});

const convertBackAnnotation = (a: AnnotationData): BaseAnnotation => ({
  ...a,
  // Only keep compatible properties
  id: a.id,
  position: a.position,
  text: a.text,
});

// Helper function to convert between different SchemeData types
const convertSchemeData = (data: BaseSchemeData): TypesSchemeData => {
  return {
    vehicles: data.vehicles.map(convertVehicle),
    paths: data.paths.map(convertPath) || [],
    annotations: data.annotations.map(convertAnnotation) || [],
    center: data.center || [0, 0],
    zoom: data.zoom || 13
  };
};

const convertBackSchemeData = (data: TypesSchemeData): BaseSchemeData => {
  return {
    vehicles: data.vehicles.map(convertBackVehicle),
    paths: data.paths.map(convertBackPath),
    annotations: data.annotations.map(convertBackAnnotation),
    center: data.center,
    zoom: data.zoom
  };
};

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
  activeTab = 'scheme'
}) => {
  // Extract geolocation data from formData if available
  const geolocationData: GeolocationData | undefined = formData?.geolocation ? {
    lat: formData.geolocation.lat,
    lng: formData.geolocation.lng,
    address: formData.geolocation.address,
    accuracy: formData.geolocation.accuracy,
    timestamp: formData.geolocation.timestamp
  } : undefined;

  // Use our custom hook to manage the scheme state
  const schemeState = useSchemeContainer({
    initialData,
    formData,
    onUpdateSchemeData: onUpdateSchemeData ? 
      (data: BaseSchemeData) => onUpdateSchemeData(data) : undefined,
    onSchemeUpdate: onSchemeUpdate ? 
      (data: BaseSchemeData) => onSchemeUpdate(data) : undefined,
    readOnly,
    geolocationData
  });
  
  // Map vehicles from our state to the format expected by react-konva
  React.useEffect(() => {
    if (initialData?.vehicles && initialData.vehicles.length > 0 && schemeState.vehicles.length === 0) {
      // Convert existing vehicles to format with x,y coordinates for Konva
      const konvaVehicles = initialData.vehicles.map(vehicle => ({
        ...vehicle,
        x: vehicle.position[0],
        y: vehicle.position[1],
        width: vehicle.width || 80,
        height: 40,
        label: vehicle.label || `Véhicule ${vehicle.type || ''}`
      }));
      schemeState.setVehicles(konvaVehicles);
    }
  }, [initialData, schemeState.vehicles.length]);

  // Force map size invalidation when component mounts or tab changes
  React.useEffect(() => {
    // Allow DOM to fully render
    const timer = setTimeout(() => {
      if (schemeState.mapRef.current) {
        console.log("SchemeContainer: Forcing map size invalidation");
        schemeState.mapRef.current.invalidateSize(true);
      }
    }, 300);
    
    // Handle window resize events
    const handleResize = () => {
      if (schemeState.mapRef.current) {
        schemeState.mapRef.current.invalidateSize(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [schemeState.mapRef, activeTab]);

  // Render the appropriate content based on the active tab
  return (
    <>
      {activeTab === 'scheme' ? (
        <VehicleScheme
          initialData={initialData ? convertSchemeData(initialData) : undefined}
          onSchemeUpdate={onUpdateSchemeData ? 
            (data: TypesSchemeData) => onUpdateSchemeData(convertBackSchemeData(data)) : undefined}
        />
      ) : (
        <SchemeContent
          // Map state
          mapCenter={schemeState.mapCenter}
          mapZoom={schemeState.mapZoom}
          drawingLayerRef={schemeState.drawingLayerRef}
          
          // UI state
          currentTool={schemeState.currentTool}
          setCurrentTool={schemeState.setCurrentTool}
          pathColor={schemeState.pathColor}
          setPathColor={schemeState.setPathColor}
          isEmpty={schemeState.isEmpty}
          
          // Hooks data and methods
          vehicles={schemeState.vehicles}
          setVehicles={schemeState.setVehicles}
          selectedVehicle={schemeState.selectedVehicle}
          currentVehicleType={schemeState.currentVehicleType}
          onChangeVehicleType={schemeState.onChangeVehicleType}
          selectVehicle={schemeState.selectVehicle}
          removeVehicle={schemeState.removeVehicle}
          rotateVehicle={schemeState.rotateVehicle}
          
          paths={schemeState.paths}
          setPaths={schemeState.setPaths}
          currentPathPoints={schemeState.currentPathPoints}
          
          annotations={schemeState.annotations}
          setAnnotations={schemeState.setAnnotations}
          updateAnnotation={schemeState.updateAnnotation}
          removeAnnotation={schemeState.removeAnnotation}
          
          // Handlers
          handleMapReadyFromHook={schemeState.handleMapReadyFromHook}
          handleCenterOnVehicles={schemeState.handleCenterOnVehicles}
          
          // Read-only state
          readOnly={readOnly}
          
          // Map refs
          mapRef={schemeState.mapRef}
          
          // Geolocation data
          geolocationData={geolocationData}
        />
      )}
    </>
  );
};

export default SchemeContainer;
