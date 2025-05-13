
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapInitializerProps {
  onMapReady: (map: L.Map) => void;
}

const MapInitializer: React.FC<MapInitializerProps> = ({ onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      // S'assurer que la carte est correctement initialisée
      map.invalidateSize();
      
      // Informer le parent que la carte est prête
      onMapReady(map);
    }
    
    // Nettoyer lors du démontage
    return () => {
      // Aucune action nécessaire pour le nettoyage ici
      // car react-leaflet gère déjà le nettoyage de la carte
    };
  }, [map, onMapReady]);

  return null; // Ce composant ne rend rien visuellement
};

export default MapInitializer;
