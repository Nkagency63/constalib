
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapResizer = () => {
  const map = useMap();

  useEffect(() => {
    // Ensure the map is properly sized when component mounts
    if (map) {
      const timer = setTimeout(() => {
        console.log("Invalidating map size");
        map.invalidateSize(true);
      }, 300);
      
      // Add window resize handler for responsive behavior
      const handleResize = () => {
        map.invalidateSize(true);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [map]);

  return null;
};

export default MapResizer;
