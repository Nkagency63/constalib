
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { SchemeData } from '../../types';
import { useVehicles } from '../../hooks/useVehicles';
import { usePaths } from '../../hooks/usePaths';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useSchemeHistory } from '../../hooks/useSchemeHistory';

export const useSchemeState = (
  formData: any, 
  onUpdateSchemeData: (data: SchemeData) => void, 
  readOnly: boolean
) => {
  // Custom hooks
  const { toast } = useToast();
  
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
  }, [vehicles, paths, annotations, onUpdateSchemeData]);

  const isEmpty = vehicles.length === 0;

  return {
    vehicles,
    selectedVehicle,
    addVehicle,
    removeVehicle,
    selectVehicle,
    setVehicles,
    rotateVehicle,
    changeVehicleType,
    currentVehicleType,
    paths,
    setPaths,
    currentPathPoints,
    isDrawing,
    startPath,
    continuePath,
    completePath,
    annotations,
    setAnnotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    saveToHistory,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    currentTool,
    setCurrentTool,
    isMapReady,
    setIsMapReady,
    showGuidesFirstTime,
    setShowGuidesFirstTime,
    mapInitialized,
    setMapInitialized,
    isEmpty,
    toast
  };
};
