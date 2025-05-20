
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapComponent = () => {
  const map = useMap();

  useEffect(() => {
    // Reliably force map size invalidation
    const timer = setTimeout(() => {
      if (map) {
        console.log("Invalidating map size from MapComponent");
        map.invalidateSize(true);
      }
    }, 300); // Slightly longer delay to ensure container is rendered

    // Clean up timeout if component unmounts
    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

export default MapComponent;
