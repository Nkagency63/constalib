
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
        
        // Clean up safely without attempting to remove controls
        try {
          console.log("Map initializer: cleaning up");
          
          // Only remove event listeners we've directly added
          // Don't try to remove any controls to avoid "s is undefined" errors
          if (map) {
            // Utiliser une approche plus sûre pour nettoyer les événements
            // On ne touche pas aux contrôles qui peuvent causer l'erreur "s is undefined"
            map.off(); // Nettoyage des événements uniquement
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
