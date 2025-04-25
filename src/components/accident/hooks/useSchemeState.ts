
import { useState, useRef } from 'react';
import L from 'leaflet';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle, Path, Annotation, SchemeData } from '../types';
import { useVehicles } from './useVehicles';
import { usePaths } from './usePaths';
import { useSchemeHistory } from './useSchemeHistory';

export const useSchemeState = (
  formData: any,
  onUpdateSchemeData: (data: SchemeData) => void,
  readOnly: boolean = false
) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const { 
    vehicles, selectedVehicle, addVehicle, removeVehicle, 
    selectVehicle, setVehicles, VEHICLE_COLORS 
  } = useVehicles();
  
  const {
    paths, setPaths, currentPathPoints, isDrawing,
    startPath, continuePath, completePath, resetPath
  } = usePaths();
  
  const { saveToHistory, handleUndo, handleRedo, canUndo, canRedo } = useSchemeHistory();

  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        if (vehicles.length < Object.keys(VEHICLE_COLORS).length) {
          const updatedVehicles = addVehicle(e.latlng);
          if (updatedVehicles && mapRef.current) {
            mapRef.current.panTo(e.latlng);
            saveToHistory({ vehicles: updatedVehicles, paths, annotations, center, zoom: 17 });
          }
        }
        break;
      case 'path':
        if (isDrawing) {
          continuePath(newPoint);
        } else {
          startPath(newPoint);
        }
        break;
      case 'annotation':
        addAnnotation(newPoint);
        break;
      case 'select':
      default:
        selectVehicle(null);
        break;
    }
  };

  const addAnnotation = (position: [number, number]) => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      position,
      text: 'Note',
      type: 'note'
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    
    saveToHistory({
      vehicles,
      paths,
      annotations: updatedAnnotations,
      center,
      zoom: 17
    });
  };

  return {
    mapRef,
    drawingLayerRef,
    currentTool,
    setCurrentTool,
    vehicles,
    paths,
    annotations,
    selectedVehicle,
    center,
    handleMapClick,
    addVehicle,
    removeVehicle,
    selectVehicle,
    setVehicles,
    setPaths,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    VEHICLE_COLORS,
    currentPathPoints,
    readOnly
  };
};
