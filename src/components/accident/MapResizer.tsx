
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapResizer = () => {
  const map = useMap();

  useEffect(() => {
    // Ensure the map is properly sized when component mounts and on window resize
    if (map) {
      // Initial resize
      const initialTimer = setTimeout(() => {
        console.log("Initial map size invalidation from MapResizer");
        map.invalidateSize(true);
      }, 300);

      // Add window resize handler
      const handleResize = () => {
        console.log("Window resize detected, invalidating map size");
        map.invalidateSize(true);
      };

      window.addEventListener('resize', handleResize);

      // Clean up
      return () => {
        clearTimeout(initialTimer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [map]);

  return null;
};

export default MapResizer;
