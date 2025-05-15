
import React, { useState, useEffect, useRef } from 'react';
import { SchemeData } from '../types';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';
import { useSchemeMap } from '../hooks/useSchemeMap';
import SchemeMapWrapper from './components/SchemeMapWrapper';
import SchemeToolbars from './components/SchemeToolbars';
import { toast } from 'sonner';
import L from 'leaflet';

interface SchemeContainerProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
}

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
}) => {
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
  
  // Map ready handler
  const handleMapReady = () => {
    // Initialize the drawing layer if needed
    if (!drawingLayerRef.current && vehiclesHook.vehicles.length > 0) {
      // Center map on vehicles when ready
      centerOnVehicles(vehiclesHook.vehicles);
    }
  };
  
  // Center on vehicles helper
  const centerOnVehicles = (vehicles: any[]) => {
    if (!vehicles.length) return;
    
    try {
      // Create bounds for all vehicles to center the map
      const points = vehicles.map(v => L.latLng(v.position));
      const bounds = L.latLngBounds(points);
      
      if (bounds.isValid()) {
        // Update the map center and zoom to fit all vehicles
        setMapCenter([
          bounds.getCenter().lat,
          bounds.getCenter().lng
        ]);
        
        // Set a reasonable zoom level
        setMapZoom(17);
        
        console.log("Map centered on vehicles", {
          center: [bounds.getCenter().lat, bounds.getCenter().lng],
          vehicles: vehicles.length
        });
      }
    } catch (error) {
      console.error("Error centering on vehicles:", error);
    }
  };
  
  // Map initialization function used with useSchemeMap hook
  const onMapReadyInit = (map: L.Map) => {
    console.log("Map ready, initializing components");
    
    // Set the drawing layer ref
    if (!drawingLayerRef.current) {
      drawingLayerRef.current = L.layerGroup().addTo(map);
    }
    
    // Execute the handleMapReady function
    handleMapReady();
  };
  
  // Integration with useSchemeMap hook - Fix the type mismatch here
  const { handleMapReady: handleMapReadyFromHook, centerOnVehicles: centerOnVehiclesFromHook } = 
    useSchemeMap({ 
      readOnly, 
      handleMapClick, 
      onReady: onMapReadyInit // This is where the type mismatch was happening
    });

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
  }, [vehiclesHook.vehicles, pathsHook.paths, annotationsHook.annotations, mapCenter, mapZoom]);
  
  // Calculate if scheme is empty (no elements added)
  const isEmpty = vehiclesHook.vehicles.length === 0 && 
                  pathsHook.paths.length === 0 && 
                  annotationsHook.annotations.length === 0;

  return (
    <div className="scheme-container h-full flex flex-col">
      <SchemeToolbars 
        readOnly={readOnly}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        onAddVehicle={() => {
          const position: [number, number] = mapCenter;
          vehiclesHook.addVehicle(position);
        }}
        canUndo={false} // We'll implement history later
        canRedo={false}
        vehicles={vehiclesHook.vehicles}
        paths={pathsHook.paths}
        annotations={annotationsHook.annotations}
        handleUndo={() => {}}
        handleRedo={() => {}}
        setVehicles={vehiclesHook.setVehicles}
        setPaths={pathsHook.setPaths}
        setAnnotations={annotationsHook.setAnnotations}
        centerOnVehicles={() => centerOnVehicles(vehiclesHook.vehicles)}
        mapRef={{ current: null }} // We'll update this when map is ready
        currentVehicleType={vehiclesHook.currentVehicleType}
        onChangeVehicleType={vehiclesHook.changeVehicleType}
        activeTab="vehicles" // Default to vehicles tab
        setActiveTab={() => {}} // No-op since we're not using tabs in this implementation
        pathColor={pathColor}
        setPathColor={setPathColor}
      />
      
      <div className="flex-1 relative h-[400px]">
        <SchemeMapWrapper
          center={mapCenter}
          vehicles={vehiclesHook.vehicles}
          paths={pathsHook.paths}
          annotations={annotationsHook.annotations}
          currentPathPoints={pathsHook.currentPathPoints}
          drawingLayerRef={drawingLayerRef}
          selectedVehicle={vehiclesHook.selectedVehicle}
          currentTool={currentTool}
          isEmpty={isEmpty}
          readOnly={readOnly}
          onVehicleSelect={vehiclesHook.selectVehicle}
          onRemoveVehicle={vehiclesHook.removeVehicle}
          onRotateVehicle={vehiclesHook.rotateVehicle}
          onChangeVehicleType={vehiclesHook.changeVehicleType}
          onRemoveAnnotation={annotationsHook.removeAnnotation}
          onUpdateAnnotation={annotationsHook.updateAnnotation}
          onMapReady={handleMapReadyFromHook}
        />
      </div>
    </div>
  );
};

export default SchemeContainer;
