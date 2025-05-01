
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
          // Appeler onMapReady avec l'objet map seulement si map existe
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
