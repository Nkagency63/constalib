
import React, { useState, useEffect } from 'react';
import { SchemeData } from '../types';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';
import { useSchemeHistory } from '../hooks/useSchemeHistory';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import SchemeMapWrapper from './components/SchemeMapWrapper';
import SchemeToolbars from './components/SchemeToolbars';
import { useSchemeMapHandlers } from './hooks/useSchemeMapHandlers';
import { TooltipProvider } from '@/components/ui/tooltip';

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
    selectVehicle, setVehicles, rotateVehicle, changeVehicleType,
    currentVehicleType
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
  const [showGuidesFirstTime, setShowGuidesFirstTime] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(0); // Pour limiter la fréquence des mises à jour
  const [mapInitialized, setMapInitialized] = useState(false);

  const {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles,
    center,
    handleToolbarAddVehicle
  } = useSchemeMapHandlers(
    formData,
    readOnly,
    currentTool,
    vehicles,
    paths,
    annotations,
    selectedVehicle,
    isDrawing,
    saveToHistory,
    addVehicle,
    selectVehicle,
    startPath,
    continuePath,
    addAnnotation,
    setVehicles,
    setShowGuidesFirstTime,
    setIsMapReady,
    setMapInitialized,
    showGuidesFirstTime
  );

  useKeyboardControls({
    selectedVehicle,
    readOnly,
    onRotateVehicle: rotateVehicle,
    onRemoveVehicle: removeVehicle
  });

  // Effet pour centrer sur les véhicules quand la carte est prête
  useEffect(() => {
    if (isMapReady && mapRef.current && vehicles.length > 0) {
      console.log("Centering on vehicles after map ready");
      setTimeout(() => centerOnVehicles(vehicles), 300);
    }
  }, [isMapReady, vehicles.length, mapRef, centerOnVehicles]);

  // Effet pour rafraîchir la carte quand currentTool change
  useEffect(() => {
    if (mapRef.current && isMapReady) {
      console.log("Tool changed, invalidating map size");
      mapRef.current.invalidateSize();
    }
  }, [currentTool, isMapReady, mapRef]);

  // Update scheme data when state changes - avec limitation de fréquence
  useEffect(() => {
    if (onUpdateSchemeData && mapRef.current) {
      const now = Date.now();
      // Limiter les mises à jour à une fois toutes les 2 secondes
      if (now - lastUpdateTime > 2000) {
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
        setLastUpdateTime(now);
      }
    }
  }, [vehicles, paths, annotations, onUpdateSchemeData, lastUpdateTime, mapRef, center]);

  const isEmpty = vehicles.length === 0;

  // Auto-switch to vehicle tool when clicking "Add Vehicle" button
  const handleAddVehicle = () => {
    setCurrentTool('vehicle');
    setTimeout(handleToolbarAddVehicle, 100);
  };

  return (
    <TooltipProvider>
      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
        <SchemeToolbars
          readOnly={readOnly}
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          onAddVehicle={handleAddVehicle}
          canUndo={canUndo}
          canRedo={canRedo}
          vehicles={vehicles}
          paths={paths}
          annotations={annotations}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          setVehicles={setVehicles}
          setPaths={setPaths}
          setAnnotations={setAnnotations}
          centerOnVehicles={centerOnVehicles}
          mapRef={mapRef}
          currentVehicleType={currentVehicleType}
          onChangeVehicleType={changeVehicleType}
        />

        <SchemeMapWrapper
          center={center}
          vehicles={vehicles}
          paths={paths}
          annotations={annotations}
          currentPathPoints={currentPathPoints}
          drawingLayerRef={drawingLayerRef}
          selectedVehicle={selectedVehicle}
          currentTool={currentTool}
          isEmpty={isEmpty}
          readOnly={readOnly}
          onVehicleSelect={selectVehicle}
          onRemoveVehicle={removeVehicle}
          onRotateVehicle={rotateVehicle}
          onChangeVehicleType={changeVehicleType}
          onRemoveAnnotation={removeAnnotation}
          onUpdateAnnotation={updateAnnotation}
          onMapReady={handleMapReady}
        />
      </div>
    </TooltipProvider>
  );
};

export default SchemeContainer;
