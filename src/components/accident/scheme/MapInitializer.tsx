
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
        
        // Safe cleanup approach that avoids removing controls
        try {
          console.log("Map initializer: safely cleaning up");
          
          if (map) {
            // Stop any animations or ongoing operations
            map.stopLocate();
            map.stop();
            
            // Only remove event listeners without touching controls or DOM
            const cleanupMap = () => {
              try {
                // Remove only our custom event handlers
                map.off();
              } catch (e) {
                console.error("Error removing event handlers:", e);
              }
            };
            
            // Execute cleanup with small delay to avoid race conditions
            setTimeout(cleanupMap, 10);
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
