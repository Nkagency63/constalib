
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
          // Make sure all existing event listeners are cleared to prevent memory leaks
          map.off();
          
          // Don't try to remove zoom controls - they're disabled at creation time now
          // Just initialize the map without modifying controls
          
          // Call onMapReady with the map object only after ensuring it's properly set up
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
