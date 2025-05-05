
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
          // This is safer than trying to manipulate controls directly
          onMapReady(map);
        } catch (error) {
          console.error("Error in map initialization:", error);
        }
      }, 300); // Increased delay to ensure rendering is complete
    }
    
    return () => {
      // Clean up event listeners without trying to remove controls
      // This avoids the "s is undefined" error
      if (map) {
        try {
          console.log("Map initializer: cleaning up");
          // Instead of removing controls which can cause errors,
          // just remove our custom event listeners
          map.off(); // Remove all event listeners
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
