
import React, { useState, useCallback, useEffect } from 'react';
import { SchemeData, Vehicle, Path, Annotation } from '../types';
import SchemeMapWrapper from './components/SchemeMapWrapper';
import SchemeToolbars from './components/SchemeToolbars';
import { useSchemeState } from './hooks/useSchemeState';
import { useSchemeMapHandlers } from './hooks/useSchemeMapHandlers';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';
import { useSchemeHistory } from '../hooks/useSchemeHistory';

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
  const [isEmpty, setIsEmpty] = useState(true);
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');

  // Use our custom hooks for scheme management
  const {
    vehicles,
    selectedVehicle,
    currentVehicleType,
    addVehicle,
    removeVehicle,
    selectVehicle,
    rotateVehicle,
    changeVehicleType,
    setVehicles
  } = useVehicles();

  const {
    paths,
    setPaths,
    currentPathPoints,
    isDrawing,
    startPath,
    continuePath,
    completePath: endPath,
    resetPath
  } = usePaths();

  const {
    annotations,
    setAnnotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation
  } = useAnnotations();

  const {
    saveToHistory,
    handleUndo: undo,
    handleRedo: redo,
    canUndo,
    canRedo
  } = useSchemeHistory();

  // Check if the scheme is empty
  useEffect(() => {
    setIsEmpty(vehicles.length === 0 && paths.length === 0 && annotations.length === 0);
  }, [vehicles, paths, annotations]);

  // Clear the entire scheme
  const clearScheme = useCallback(() => {
    setVehicles([]);
    setPaths([]);
    setAnnotations([]);
    selectVehicle(null);
    saveToHistory({
      vehicles: [],
      paths: [],
      annotations: [],
      center: formData?.geolocation?.lat && formData?.geolocation?.lng
        ? [formData.geolocation.lat, formData.geolocation.lng]
        : [48.8566, 2.3522],
      zoom: 17
    });
  }, [setVehicles, setPaths, setAnnotations, selectVehicle, saveToHistory, formData]);

  // Map handlers
  const {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles,
    center,
    handleToolbarAddVehicle
  } = useSchemeMapHandlers({
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
  });

  // Update parent component when scheme data changes
  useEffect(() => {
    if (isMapReady && mapInitialized) {
      const schemeData: SchemeData = {
        vehicles,
        paths,
        annotations,
        center: mapRef.current ? [
          mapRef.current.getCenter().lat,
          mapRef.current.getCenter().lng
        ] : center,
        zoom: mapRef.current ? mapRef.current.getZoom() : 17
      };
      
      onUpdateSchemeData(schemeData);
    }
  }, [vehicles, paths, annotations, isMapReady, mapInitialized, onUpdateSchemeData, mapRef, center]);

  // Function to add a default vehicle at the center of the map
  const handleAddVehicle = useCallback(() => {
    if (vehicles.length >= 4) return; // Maximum 4 vehicles
    handleToolbarAddVehicle();
  }, [vehicles.length, handleToolbarAddVehicle]);

  return (
    <div className="w-full flex flex-col" id={SCHEME_INSTANCE_ID}>
      {!readOnly && (
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
          handleUndo={undo}
          handleRedo={redo}
          setVehicles={setVehicles}
          setPaths={setPaths}
          setAnnotations={setAnnotations}
          centerOnVehicles={centerOnVehicles}
          mapRef={mapRef}
          currentVehicleType={currentVehicleType}
          onChangeVehicleType={changeVehicleType}
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
