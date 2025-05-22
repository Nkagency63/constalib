
import { useState, useRef, useCallback } from 'react';
import L from 'leaflet';
import { SchemeData, Vehicle, Path, Annotation } from '../../types';

interface UseSchemeStateProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
}

export const useSchemeState = ({ formData, onUpdateSchemeData }: UseSchemeStateProps) => {
  // Map references
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  
  // Get default center coordinates from formData or use Paris as default
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];
  
  // State for scheme elements
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  
  // State for map initialization
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // State for feedback and UI
  const [showGuidesFirstTime, setShowGuidesFirstTime] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  
  // Handle scheme data updates with frequency limitation
  const updateSchemeData = useCallback(() => {
    if (onUpdateSchemeData && mapRef.current) {
      const now = Date.now();
      // Limit updates to once every 2 seconds
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
  }, [vehicles, paths, annotations, onUpdateSchemeData, lastUpdateTime, center]);
  
  // Handle map ready event
  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
    setIsMapReady(true);
    setMapInitialized(true);
  }, []);
  
  return {
    // Map references
    mapRef,
    drawingLayerRef,
    
    // Map state
    center,
    isMapReady,
    mapInitialized,
    
    // Scheme elements
    vehicles,
    setVehicles,
    paths,
    setPaths,
    annotations,
    setAnnotations,
    selectedVehicle,
    setSelectedVehicle,
    
    // UI state
    currentTool,
    setCurrentTool,
    showGuidesFirstTime,
    setShowGuidesFirstTime,
    
    // Handlers
    handleMapReady,
    updateSchemeData,
    setIsMapReady,
    setMapInitialized,
    setLastUpdateTime
  };
};
