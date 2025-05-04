
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
          // Simply pass the map object to onMapReady
          // Avoiding any control manipulation that could cause errors
          console.log("Map initializer: ready to call onMapReady");
          onMapReady(map);
        } catch (error) {
          console.error("Error in map initialization:", error);
        }
      }, 100); // Small delay to ensure rendering is complete
    }
    
    return () => {
      // Clean up event listeners to prevent memory leaks
      if (map) {
        try {
          // Only clean up event listeners without touching controls
          console.log("Map initializer: cleaning up event listeners");
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
