
import React, { useState, useCallback, useEffect } from 'react';
import { SchemeData, Vehicle, Path, Annotation } from '../types';
import SchemeMapWrapper from './components/SchemeMapWrapper';
import SchemeToolbars from './components/SchemeToolbars';
import { useSchemeState } from './hooks/useSchemeState';
import { useSchemeMapHandlers } from './hooks/useSchemeMapHandlers';
import { createDefaultVehicle } from './SchemeVehicleInitializer';

// Unique ID for the scheme to prevent duplicate instances
const SCHEME_INSTANCE_ID = 'scheme-' + Math.random().toString(36).substring(2, 9);

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
  // State initialization
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Track if this is the first load
  const [showGuidesFirstTime, setShowGuidesFirstTime] = useState(true);

  // Use our custom hooks
  const {
    vehicles,
    paths,
    annotations,
    currentPathPoints,
    selectedVehicle,
    isDrawing,
    currentTool,
    history,
    historyIndex,
    addVehicle,
    selectVehicle,
    startPath,
    continuePath,
    endPath,
    addAnnotation,
    setVehicles,
    setPaths,
    setAnnotations,
    setCurrentTool,
    saveToHistory,
    undo,
    redo,
    removeVehicle,
    updateVehiclePosition,
    rotateVehicle,
    changeVehicleType,
    removeAnnotation,
    updateAnnotation,
    clearScheme,
    isEmpty
  } = useSchemeState();

  // Map handlers
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

  // Update parent component when scheme data changes
  useEffect(() => {
    if (isMapReady && mapInitialized) {
      const schemeData: SchemeData = {
        vehicles,
        paths,
        annotations
      };
      
      onUpdateSchemeData(schemeData);
    }
  }, [vehicles, paths, annotations, isMapReady, mapInitialized, onUpdateSchemeData]);

  // Function to add a default vehicle at the center of the map
  const handleAddVehicle = useCallback(() => {
    if (vehicles.length >= 4) return; // Maximum 4 vehicles
    handleToolbarAddVehicle();
  }, [vehicles.length, handleToolbarAddVehicle]);

  return (
    <div className="w-full flex flex-col" id={SCHEME_INSTANCE_ID}>
      {!readOnly && (
        <SchemeToolbars
          onAddVehicle={handleAddVehicle}
          onStartPath={() => setCurrentTool('path')}
          onAddAnnotation={() => setCurrentTool('annotation')}
          onSelect={() => {
            setCurrentTool('select');
            selectVehicle(null);  // Deselect any selected vehicle
          }}
          onClear={() => {
            if (confirm("Êtes-vous sûr de vouloir effacer le schéma ?")) {
              clearScheme();
            }
          }}
          onUndo={undo}
          onRedo={redo}
          currentTool={currentTool}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          isEmpty={isEmpty}
        />
      )}
      
      <div className="mt-4">
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
    </div>
  );
};

export default SchemeContainer;
