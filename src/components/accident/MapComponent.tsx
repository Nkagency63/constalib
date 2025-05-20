
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapComponent = () => {
  const map = useMap();

  useEffect(() => {
    // Force de manière fiable l'invalidation de la taille de la carte
    const timer = setTimeout(() => {
      if (map) {
        console.log("Invalidating map size from MapComponent");
        map.invalidateSize(true);
      }
    }, 300); // Délai légèrement plus long pour s'assurer que le conteneur est rendu

    // Nettoyage du timeout en cas de démontage du composant
    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

export default MapComponent;
