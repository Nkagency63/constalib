
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
      const timeoutId = setTimeout(() => {
        try {
          // Make sure the map is still valid before proceeding
          if (map && map.getContainer && !map.getContainer().parentElement) {
            console.log("Map container has been removed, skipping initialization");
            return;
          }
          
          // Make sure all existing event listeners are cleared to prevent memory leaks
          // Only clear events if the map is valid
          if (map && typeof map.off === 'function') {
            map.off();
          }
          
          // Call onMapReady with the map object only after ensuring it's properly set up
          onMapReady(map);
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }, 100); // Small delay to ensure rendering is complete
      
      return () => {
        // Clear the timeout to prevent callbacks after unmount
        clearTimeout(timeoutId);
        
        // Clean up event listeners to prevent memory leaks
        if (map) {
          try {
            // Only attempt to remove listeners if the map is still valid
            // @ts-ignore - _isDestroyed might exist at runtime but not in type definitions
            if (typeof map.off === 'function' && !map._isDestroyed) {
              map.off();
            }
          } catch (error) {
            console.error("Error cleaning up map:", error);
          }
        }
      };
    }
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
