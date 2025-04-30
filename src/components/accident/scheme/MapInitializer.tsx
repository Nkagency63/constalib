
import React from 'react';
import { useMap } from 'react-leaflet';
import { Map } from 'leaflet';

interface MapInitializerProps {
  onMapReady: (map: Map) => void;
}

const MapInitializer = ({ onMapReady }: MapInitializerProps) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (map) {
      // Appeler onMapReady avec l'objet map seulement si map existe
      onMapReady(map);
    }
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
