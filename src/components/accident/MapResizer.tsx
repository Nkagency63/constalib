
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapResizer = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);

  return null;
};

export default MapResizer;
