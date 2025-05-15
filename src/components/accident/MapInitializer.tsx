
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
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
        
        // Call the callback with the map object
        onMapReady(map);
      } catch (error) {
        console.error("Error in map initialization:", error);
      }
    }
    
    return () => {
      try {
        console.log("Map initializer: safely cleaning up");
        
        // No need to try removing controls or stopping events that might not exist
        // Just make sure we don't attempt to access the map after it's disposed
        if (map && !map._isDestroyed) {
          map.off();
        }
      } catch (error) {
        console.error("Error cleaning up map:", error);
      }
    };
  }, [map, onMapReady]);
  
  return null;
};

export default MapInitializer;
