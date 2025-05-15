
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapInitializerProps {
  onMapReady?: (map: L.Map) => void;
  setCenter?: (center: [number, number]) => void;
  setZoom?: (zoom: number) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  onMapDoubleClick?: () => void;
  onMapMove?: (latlng: L.LatLng) => void;
}

const MapInitializer: React.FC<MapInitializerProps> = ({
  onMapReady,
  setCenter,
  setZoom,
  onMapClick,
  onMapDoubleClick,
  onMapMove
}) => {
  const map = useMap();
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (map) {
      // Delay initialization to ensure DOM is ready
      timerRef.current = window.setTimeout(() => {
        try {
          console.log("Map initializer: map object is ready");
          
          // Force invalidate size to ensure proper rendering
          map.invalidateSize();
          
          // Set up event handlers
          if (onMapClick) {
            map.on('click', (e) => onMapClick(e.latlng));
          }
          
          if (onMapDoubleClick) {
            map.on('dblclick', (e) => {
              // Prevent default zoom behavior
              L.DomEvent.stopPropagation(e);
              onMapDoubleClick();
            });
          }
          
          if (onMapMove) {
            map.on('mousemove', (e) => onMapMove(e.latlng));
          }
          
          if (setCenter) {
            map.on('moveend', () => setCenter(
              [map.getCenter().lat, map.getCenter().lng] as [number, number]
            ));
          }
          
          if (setZoom) {
            map.on('zoomend', () => setZoom(map.getZoom()));
          }
          
          // Call the onMapReady callback if provided
          if (onMapReady) {
            onMapReady(map);
          }
        } catch (error) {
          console.error("Error in map initialization:", error);
        }
      }, 500); // Increased delay to ensure rendering is complete
      
      return () => {
        // Clear the timeout on unmount
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        try {
          console.log("Map initializer: safely cleaning up");
          
          // Clean up event listeners we've added, but safely
          if (map) {
            // Safe cleanup without accessing potentially non-existent properties
            if (onMapClick) map.off('click');
            if (onMapDoubleClick) map.off('dblclick');
            if (onMapMove) map.off('mousemove');
            if (setCenter) map.off('moveend');
            if (setZoom) map.off('zoomend');
          }
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      };
    }
  }, [map, onMapReady, setCenter, setZoom, onMapClick, onMapDoubleClick, onMapMove]);
  
  return null;
};

export default MapInitializer;
