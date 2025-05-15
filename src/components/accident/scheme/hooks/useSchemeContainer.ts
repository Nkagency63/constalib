
import { useState, useEffect, useRef, useCallback } from 'react';
import { SchemeData } from '../../types';
import { useVehicles } from '../../hooks/useVehicles';
import { usePaths } from '../../hooks/usePaths';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useSchemeMap } from '../../hooks/useSchemeMap';
import L from 'leaflet';
import { toast } from 'sonner';

interface UseSchemeContainerProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
}

export const useSchemeContainer = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
}: UseSchemeContainerProps) => {
  // State for map and tools
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [pathColor, setPathColor] = useState<string>('#ff0000');
  
  // Refs
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  
  // Custom hooks
  const vehiclesHook = useVehicles();
  const pathsHook = usePaths();
  const annotationsHook = useAnnotations();
  
  // Initialize map with geolocation from formData if available
  useEffect(() => {
    if (formData?.geolocation?.lat && formData?.geolocation?.lng) {
      setMapCenter([formData.geolocation.lat, formData.geolocation.lng]);
      setMapZoom(17);
    } else if (initialData?.center) {
      setMapCenter(initialData.center);
      setMapZoom(initialData.zoom || 17);
    }
    
    // Initialize vehicles if provided in initial data
    if (initialData?.vehicles && initialData.vehicles.length > 0) {
      vehiclesHook.setVehicles(initialData.vehicles);
    }
    
    // Initialize paths if provided
    if (initialData?.paths && initialData.paths.length > 0) {
      pathsHook.setPaths(initialData.paths);
    }
    
    // Initialize annotations if provided
    if (initialData?.annotations && initialData.annotations.length > 0) {
      annotationsHook.setAnnotations(initialData.annotations);
    }
  }, [formData, initialData]);

  // Map click handler
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (readOnly) return;
    
    const latlng = e.latlng;
    const coords: [number, number] = [latlng.lat, latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        vehiclesHook.addVehicle(coords);
        break;
      case 'path':
        if (pathsHook.isDrawing) {
          pathsHook.continuePath(coords);
        } else {
          pathsHook.startPath(coords);
        }
        break;
      case 'annotation':
        annotationsHook.addAnnotation(coords, 'Double-click to edit');
        break;
    }
  };
  
  // Corrigeons l'intégration avec useSchemeMap
  const { mapRef, drawingLayerRef: mapDrawingLayerRef, handleMapReady: handleMapReadyFromHook, centerOnVehicles } = 
    useSchemeMap({ 
      readOnly, 
      handleMapClick,
      onReady: (map) => handleMapReady(map)
    });
  
  // Center on vehicles helper
  const handleCenterOnVehicles = useCallback(() => {
    centerOnVehicles(vehiclesHook.vehicles);
  }, [centerOnVehicles, vehiclesHook.vehicles]);

  // Map ready handler - pour recevoir le paramètre map
  const handleMapReady = useCallback((map: L.Map) => {
    // Initialize the drawing layer if needed
    if (!drawingLayerRef.current) {
      drawingLayerRef.current = L.layerGroup().addTo(map);
      
      // Center map on vehicles when ready
      if (vehiclesHook.vehicles.length > 0) {
        centerOnVehicles(vehiclesHook.vehicles);
      }
    }
  }, [centerOnVehicles, vehiclesHook.vehicles]);

  // Update parent with current scheme data
  useEffect(() => {
    const updateCallback = onUpdateSchemeData || onSchemeUpdate;
    if (updateCallback) {
      const currentData: SchemeData = {
        vehicles: vehiclesHook.vehicles,
        paths: pathsHook.paths,
        annotations: annotationsHook.annotations,
        center: mapCenter,
        zoom: mapZoom,
      };
      updateCallback(currentData);
    }
  }, [vehiclesHook.vehicles, pathsHook.paths, annotationsHook.annotations, mapCenter, mapZoom, onUpdateSchemeData, onSchemeUpdate]);
  
  // Calculate if scheme is empty (no elements added)
  const isEmpty = vehiclesHook.vehicles.length === 0 && 
                  pathsHook.paths.length === 0 && 
                  annotationsHook.annotations.length === 0;

  return {
    // Map state
    mapCenter,
    mapZoom,
    drawingLayerRef,
    
    // UI state
    currentTool,
    setCurrentTool,
    pathColor,
    setPathColor,
    isEmpty,
    
    // Hooks data and methods
    vehicles: vehiclesHook.vehicles,
    setVehicles: vehiclesHook.setVehicles,
    selectedVehicle: vehiclesHook.selectedVehicle,
    currentVehicleType: vehiclesHook.currentVehicleType,
    onChangeVehicleType: vehiclesHook.changeVehicleType,
    selectVehicle: vehiclesHook.selectVehicle,
    removeVehicle: vehiclesHook.removeVehicle,
    rotateVehicle: vehiclesHook.rotateVehicle,
    
    paths: pathsHook.paths,
    setPaths: pathsHook.setPaths,
    currentPathPoints: pathsHook.currentPathPoints,
    
    annotations: annotationsHook.annotations,
    setAnnotations: annotationsHook.setAnnotations,
    updateAnnotation: annotationsHook.updateAnnotation,
    removeAnnotation: annotationsHook.removeAnnotation,
    
    // Handlers
    handleMapClick,
    handleMapReady,
    handleMapReadyFromHook,
    handleCenterOnVehicles,
    
    // Read-only state
    readOnly,
    
    // Map refs from useSchemeMap
    mapRef
  };
};
