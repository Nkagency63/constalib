
import React from 'react';
import { SchemeData, GeolocationData } from '../types';
import { useSchemeContainer } from './hooks/useSchemeContainer';
import SchemeContent from './components/SchemeContent';
import VehicleScheme from '../../VehicleScheme';

interface SchemeContainerProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
  activeTab?: string;
}

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
    onUpdateSchemeData,
    onSchemeUpdate,
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
        width: 80,
        height: 40
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
          initialData={initialData}
          onSchemeUpdate={onUpdateSchemeData}
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
