
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
      setTimeout(() => {
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
    }
    
    return () => {
      // Clean up event listeners without trying to remove controls
      if (map) {
        try {
          console.log("Map initializer: cleaning up");
          // Don't attempt to remove controls, which can cause "s is undefined" errors
          // Just remove event listeners we've added
          map.off();
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
