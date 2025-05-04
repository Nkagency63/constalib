
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
          // Just ensure event listeners are properly initialized
          // No need to attempt removing controls as they're disabled at creation time
          
          // Call onMapReady with the map object
          onMapReady(map);
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }, 100); // Small delay to ensure rendering is complete
    }
    
    return () => {
      // Clean up event listeners to prevent memory leaks
      if (map) {
        try {
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
