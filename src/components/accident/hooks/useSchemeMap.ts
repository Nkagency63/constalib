
import { useRef, useCallback } from 'react';
import L from 'leaflet';
import { Vehicle } from '../types';

interface UseSchemeMapProps {
  readOnly: boolean;
  handleMapClick: (e: L.LeafletMouseEvent) => void;
  onReady: () => void;
}

export const useSchemeMap = ({ readOnly, handleMapClick, onReady }: UseSchemeMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);

  const handleMapReady = useCallback((map: L.Map) => {
    console.log("Map initialization started");
    mapRef.current = map;
    
    // Configure event handlers if not readonly
    if (!readOnly && mapRef.current) {
      // Make sure to remove any previous click handlers first
      mapRef.current.off('click');
      // Then add our new click handler
      mapRef.current.on('click', handleMapClick);
      console.log("Map click handler registered");
    }
    
    // Ensure map is properly sized
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        console.log("Map size invalidated");
      }
    }, 100);
    
    // Call the onReady callback to initialize the map
    onReady();
    console.log("Map initialization completed");
  }, [readOnly, handleMapClick, onReady]);

  const centerOnVehicles = useCallback((vehicles: Vehicle[]) => {
    if (!mapRef.current || vehicles.length === 0) return;
    
    console.log("Centering on vehicles:", vehicles.length);
    
    try {
      // Create a bounds object to contain all vehicle positions
      const bounds = L.latLngBounds(vehicles.map(v => v.position));
      
      // Slightly pad the bounds for better visibility
      bounds.pad(0.2);
      
      // Adjust the map to these bounds with animation
      mapRef.current.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 0.5,
        maxZoom: 18
      });
      
      // Force a map refresh
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);
      
      console.log("Map centered on vehicles successfully");
    } catch (error) {
      console.error("Error centering on vehicles:", error);
    }
  }, []);

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles
  };
};
