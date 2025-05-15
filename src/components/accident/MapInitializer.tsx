
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
      // Mark initialization as done to prevent duplicate calls
      initDoneRef.current = true;
      
      try {
        console.log("Map initializer: map object is ready");
        
        // Force invalidate size to ensure proper rendering
        map.invalidateSize();
        
        // Call the callback with the map object
        onMapReady(map);
      } catch (error) {
        console.error("Error in map initialization:", error);
      }
    }
    
    return () => {
      try {
        console.log("Map initializer: safely cleaning up");
        
        if (map) {
          // Only stop ongoing operations
          map.stopLocate();
          map.stop();
          
          // Safely remove our event listeners without trying to access controls
          map.off('click');
          map.off('move');
          map.off('zoom');
          map.off('moveend');
          map.off('zoomend');
          map.off('dragend');
        }
      } catch (error) {
        console.error("Error cleaning up map:", error);
      }
    };
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
