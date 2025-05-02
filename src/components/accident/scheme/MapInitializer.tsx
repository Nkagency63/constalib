
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
      // Use requestAnimationFrame to ensure the DOM is fully rendered
      // before initializing the map, which helps prevent the "s is undefined" error
      requestAnimationFrame(() => {
        try {
          // Make sure all existing event listeners are cleared to prevent memory leaks
          map.off();
          
          // Ensure zoom controls are properly initialized before trying to remove them
          // This prevents the "s is undefined" error which occurs when trying to 
          // access properties of controls that aren't properly initialized
          if (map.zoomControl) {
            map.removeControl(map.zoomControl);
          }
          
          // Call onMapReady with the map object only after ensuring it's properly set up
          onMapReady(map);
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      });
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
