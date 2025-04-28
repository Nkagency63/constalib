
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
    mapRef.current = map;
    
    // Only try to remove controls if they exist
    if (mapRef.current) {
      // Safely check and remove zoom control
      const zoomControl = mapRef.current.zoomControl;
      if (zoomControl) {
        mapRef.current.removeControl(zoomControl);
      }

      // Setup event handlers if not readOnly
      if (!readOnly) {
        mapRef.current.on('click', handleMapClick);
      }
    }
    
    // Call the onReady callback to initialize the map
    onReady();
  }, [readOnly, handleMapClick, onReady]);

  const centerOnVehicles = useCallback((vehicles: Vehicle[]) => {
    if (!mapRef.current || vehicles.length === 0) return;
    
    // Create a bounds object to contain all vehicle positions
    const bounds = L.latLngBounds(vehicles.map(v => v.position));
    
    // Expand bounds slightly for better visibility
    bounds.pad(0.2);
    
    // Fit the map to these bounds with animation
    mapRef.current.flyToBounds(bounds, {
      padding: [50, 50],
      duration: 0.5
    });
  }, []);

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles
  };
};
