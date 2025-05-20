
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapComponent = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);

  return null;
};

export default MapComponent;
