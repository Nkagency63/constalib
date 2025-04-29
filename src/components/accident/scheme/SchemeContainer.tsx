
import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import CanvasToolbar from './CanvasToolbar';
import SchemeToolbar from './SchemeToolbar';
import MapContainer from './MapContainer';
import SchemeInfo from './SchemeInfo';
import { SchemeData } from '../types';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';
import { useSchemeHistory } from '../hooks/useSchemeHistory';
import { useSchemeMap } from '../hooks/useSchemeMap';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { handleMapClick } from './SchemeMapHandlers';
import { initializeVehicles } from './SchemeVehicleInitializer';
import { handleUndoWrapper, handleRedoWrapper } from './SchemeUndoRedo';
import { handleExportImage } from './SchemeExport';

interface SchemeContainerProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
  readOnly?: boolean;
}

const SchemeContainer = ({ 
  formData, 
  onUpdateSchemeData, 
  readOnly = false 
}: SchemeContainerProps) => {
  // Custom hooks
  const { 
    vehicles, selectedVehicle, addVehicle, removeVehicle, 
    selectVehicle, setVehicles, rotateVehicle
  } = useVehicles();
  
  const {
    paths, setPaths, currentPathPoints, isDrawing,
    startPath, continuePath, completePath, resetPath
  } = usePaths();
  
  const {
    annotations, setAnnotations, addAnnotation,
    updateAnnotation, removeAnnotation
  } = useAnnotations();
  
  const { 
    saveToHistory, handleUndo, handleRedo, canUndo, canRedo 
  } = useSchemeHistory();
  
  // Local state
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [isMapReady, setIsMapReady] = useState(false);

  // Get default center coordinates from formData or use Paris as default
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];

  const { mapRef, drawingLayerRef, handleMapReady, centerOnVehicles } = useSchemeMap({
    readOnly,
    handleMapClick: (e) => handleMapClick(e, {
      readOnly,
      currentTool,
      vehicles,
      paths,
      annotations,
      selectedVehicle,
      isDrawing,
      centerOnVehicles,
      saveToHistory,
      addVehicle,
      selectVehicle,
      startPath,
      continuePath,
      addAnnotation
    }),
    onReady: () => {
      setIsMapReady(true);
      const initialized = initializeVehicles({
        formData,
        vehiclesLength: vehicles.length,
        setVehicles,
        saveToHistory
      });
      
      if (initialized) {
        // Auto-center on vehicles after initialization
        setTimeout(() => centerOnVehicles(vehicles), 300);
      }
    }
  });

  // Setup keyboard controls for vehicles
  useKeyboardControls({
    selectedVehicle,
    readOnly,
    onRotateVehicle: rotateVehicle,
    onRemoveVehicle: removeVehicle
  });

  // Center on vehicles when they change
  useEffect(() => {
    if (vehicles.length > 0 && isMapReady) {
      centerOnVehicles(vehicles);
    }
  }, [vehicles.length, isMapReady]);

  // Update scheme data when state changes
  useEffect(() => {
    if (onUpdateSchemeData && mapRef.current) {
      const schemeData: SchemeData = {
        vehicles,
        paths,
        annotations,
        center: mapRef.current ? [
          mapRef.current.getCenter().lat,
          mapRef.current.getCenter().lng
        ] as [number, number] : center,
        zoom: mapRef.current ? mapRef.current.getZoom() : 17
      };
      onUpdateSchemeData(schemeData);
    }
  }, [vehicles, paths, annotations, onUpdateSchemeData]);

  // Handle vehicle add from toolbar
  const handleAddVehicle = () => {
    if (mapRef.current && vehicles.length < 4) {
      const center = mapRef.current.getCenter();
      const updatedVehicles = addVehicle(center);
      if (updatedVehicles) {
        saveToHistory({ 
          vehicles: updatedVehicles, 
          paths, 
          annotations, 
          center: [center.lat, center.lng], 
          zoom: mapRef.current.getZoom() 
        });
        centerOnVehicles(updatedVehicles);
      }
    } else {
      toast.warning("Maximum de 4 véhicules atteint");
    }
  };

  return (
    <TooltipProvider>
      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
        {!readOnly && (
          <CanvasToolbar 
            onAddVehicle={handleAddVehicle}
            onUndo={() => handleUndoWrapper({
              canUndo, vehicles, paths, annotations,
              handleUndo, setVehicles, setPaths, setAnnotations,
              centerOnVehicles, mapRef
            })}
            onRedo={() => handleRedoWrapper({
              canRedo, vehicles, paths, annotations,
              handleRedo, setVehicles, setPaths, setAnnotations,
              centerOnVehicles, mapRef
            })}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            canUndo={canUndo}
            canRedo={canRedo}
            onExportImage={() => handleExportImage({ mapRef })}
            onCenterVehicles={() => centerOnVehicles(vehicles)}
          />
        )}

        {!readOnly && (
          <SchemeToolbar 
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
          />
        )}

        <MapContainer 
          center={center}
          zoom={17}
          vehicles={vehicles}
          paths={paths}
          annotations={annotations}
          currentPathPoints={currentPathPoints}
          drawingLayerRef={drawingLayerRef}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={selectVehicle}
          onRemoveVehicle={removeVehicle}
          onRotateVehicle={rotateVehicle}
          onRemoveAnnotation={removeAnnotation}
          onUpdateAnnotation={updateAnnotation}
          onMapReady={handleMapReady}
          readOnly={readOnly}
        />

        <SchemeInfo 
          vehicleCount={vehicles.length}
          pathCount={paths.length}
          annotationCount={annotations.length}
          isEmpty={vehicles.length === 0}
        />
      </div>
    </TooltipProvider>
  );
};

export default SchemeContainer;
