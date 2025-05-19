import { useState, useEffect, useRef, useCallback } from 'react';
import { SchemeData, GeolocationData } from '../../types';
import { useVehicles } from '../../hooks/useVehicles';
import { usePaths } from '../../hooks/usePaths';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useSchemeMap } from '../../hooks/useSchemeMap';
import L from 'leaflet';
import { toast } from 'sonner';
import { handleMapClick } from '../SchemeMapHandlers';
import initializeVehicles from '../SchemeVehicleInitializer';

interface UseSchemeContainerProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
  geolocationData?: GeolocationData;
}

export const useSchemeContainer = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
  geolocationData
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
  
  // Initialize map with geolocation from formData or geolocationData if available
  useEffect(() => {
    let centerLat = 48.8566;
    let centerLng = 2.3522;
    let zoom = 13;
    
    // Priority 1: Use geolocationData if provided
    if (geolocationData?.lat && geolocationData?.lng) {
      centerLat = geolocationData.lat;
      centerLng = geolocationData.lng;
      zoom = 17;
    }
    // Priority 2: Use formData.geolocation if provided
    else if (formData?.geolocation?.lat && formData?.geolocation?.lng) {
      centerLat = formData.geolocation.lat;
      centerLng = formData.geolocation.lng;
      zoom = 17;
    }
    // Priority 3: Use initialData.center if provided
    else if (initialData?.center) {
      centerLat = initialData.center[0];
      centerLng = initialData.center[1];
      zoom = initialData.zoom || 17;
    }
    
    setMapCenter([centerLat, centerLng]);
    setMapZoom(zoom);
    
    console.log("Setting map center to:", [centerLat, centerLng], "with zoom:", zoom);
    
    // Initialize vehicles
    if (initialData?.vehicles && initialData.vehicles.length > 0) {
      // If we have initial data, use it
      vehiclesHook.setVehicles(initialData.vehicles);
    } else if (vehiclesHook.vehicles.length === 0) {
      // Otherwise if we don't have any vehicles yet, initialize with A and B vehicles
      console.log("Initializing vehicles A and B");
      const initialVehicles = initializeVehicles(formData);
      vehiclesHook.setVehicles(initialVehicles);
    }
    
    // Initialize paths if provided
    if (initialData?.paths && initialData.paths.length > 0) {
      pathsHook.setPaths(initialData.paths);
    }
    
    // Initialize annotations if provided
    if (initialData?.annotations && initialData.annotations.length > 0) {
      annotationsHook.setAnnotations(initialData.annotations);
    }
  }, [formData, initialData, geolocationData]);

  // Map click handler integration with SchemeMapHandlers
  const handleMapClickWrapper = useCallback((e: L.LeafletMouseEvent) => {
    handleMapClick(e, {
      readOnly,
      currentTool,
      vehicles: vehiclesHook.vehicles,
      paths: pathsHook.paths,
      annotations: annotationsHook.annotations,
      selectedVehicle: vehiclesHook.selectedVehicle,
      isDrawing: pathsHook.isDrawing,
      centerOnVehicles: handleCenterOnVehicles,
      saveToHistory: () => ({}), // We'll implement history later if needed
      addVehicle: (latlng: L.LatLng) => {
        const coords: [number, number] = [latlng.lat, latlng.lng];
        return vehiclesHook.addVehicle(coords);
      },
      selectVehicle: vehiclesHook.selectVehicle,
      startPath: pathsHook.startPath,
      continuePath: pathsHook.continuePath,
      addAnnotation: (point: [number, number]) => {
        annotationsHook.addAnnotation(point, 'Double-cliquez pour éditer');
        return annotationsHook.annotations;
      }
    });
  }, [readOnly, currentTool, vehiclesHook, pathsHook, annotationsHook]);
  
  // Integration with useSchemeMap
  const { mapRef, handleMapReady: handleMapReadyFromHook, centerOnVehicles } = 
    useSchemeMap({ 
      readOnly, 
      handleMapClick: handleMapClickWrapper,
      onReady: (map) => handleMapReady(map)
    });
  
  // Center on vehicles helper
  const handleCenterOnVehicles = useCallback(() => {
    centerOnVehicles(vehiclesHook.vehicles);
  }, [centerOnVehicles, vehiclesHook.vehicles]);

  // Map ready handler
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
    handleMapClick: handleMapClickWrapper,
    handleMapReady,
    handleMapReadyFromHook,
    handleCenterOnVehicles,
    
    // Read-only state
    readOnly,
    
    // Map refs from useSchemeMap
    mapRef
  };
};
