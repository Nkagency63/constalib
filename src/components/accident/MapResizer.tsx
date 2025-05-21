
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapResizer = () => {
  const map = useMap();

  useEffect(() => {
    if (map && typeof map.invalidateSize === 'function') {
      const timer = setTimeout(() => {
        map.invalidateSize(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [map]);

  return null;
};

export default MapResizer;
