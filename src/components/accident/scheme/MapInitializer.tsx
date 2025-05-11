
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Map } from 'leaflet';

interface MapInitializerProps {
  onMapReady: (map: Map) => void;
}

const MapInitializer = ({ onMapReady }: MapInitializerProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      // Delay initialization to ensure DOM is ready
      const timer = setTimeout(() => {
        try {
          console.log("Map initializer: map object is ready");
          
          // Force invalidate size to ensure proper rendering
          map.invalidateSize();
          
          // Call the callback with the map object
          onMapReady(map);
        } catch (error) {
          console.error("Error in map initialization:", error);
        }
      }, 500); // Increased delay to ensure rendering is complete
      
      return () => {
        // Clear the timeout on unmount
        clearTimeout(timer);
        
        // IMPORTANT: DO NOT try to remove controls here
        // This is what's causing the "s is undefined" error
        try {
          console.log("Map initializer: safely cleaning up");
          
          if (map) {
            // Stop any animations or ongoing operations
            map.stopLocate();
            map.stop();
            
            // Only remove event listeners we've added ourselves
            try {
              map.off('click');
              map.off('move');
              map.off('zoom');
              map.off('moveend');
              map.off('zoomend');
              map.off('dragend');
            } catch (e) {
              console.error("Error removing event handlers:", e);
            }
          }
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      };
    }
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
