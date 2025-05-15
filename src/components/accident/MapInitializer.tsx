
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapInitializerProps {
  onMapReady: (map: L.Map) => void;
}

const MapInitializer: React.FC<MapInitializerProps> = ({ onMapReady }) => {
  const map = useMap();
  const initDoneRef = useRef(false);
  
  useEffect(() => {
    if (map && !initDoneRef.current) {
      // Marquer l'initialisation comme terminée pour éviter les appels dupliqués
      initDoneRef.current = true;
      
      try {
        console.log("Map initializer: map object is ready");
        
        // Forcer invalidateSize pour assurer un rendu correct
        setTimeout(() => {
          map.invalidateSize();
          
          // Appeler le callback avec l'objet map
          onMapReady(map);
        }, 100); // Délai réduit pour une meilleure réactivité
      } catch (error) {
        console.error("Error in map initialization:", error);
      }
    }
    
    return () => {
      try {
        console.log("Map initializer: safely cleaning up");
        
        // Nettoyage sécurisé sans accéder à des propriétés potentiellement inexistantes
        if (map) {
          // Supprimer tous les écouteurs d'événements que nous avons ajoutés
          map.off();
        }
      } catch (error) {
        console.error("Error cleaning up map:", error);
      }
    };
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
