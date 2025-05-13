
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapInitializerProps {
  setCenter?: (center: [number, number]) => void;
  setZoom?: (zoom: number) => void;
  onMapClick?: (latlng: any) => void;
  onMapDoubleClick?: () => void;
  onMapMove?: (latlng: any) => void;
  onMapReady?: (map: L.Map) => void;
}

const MapInitializer: React.FC<MapInitializerProps> = ({ 
  setCenter, 
  setZoom, 
  onMapClick, 
  onMapDoubleClick, 
  onMapMove,
  onMapReady 
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      // S'assurer que la carte est correctement initialisée
      map.invalidateSize();
      
      // Set up event listeners if provided
      if (onMapClick) {
        map.on('click', onMapClick);
      }
      
      if (onMapDoubleClick) {
        map.on('dblclick', onMapDoubleClick);
      }
      
      if (onMapMove) {
        map.on('mousemove', onMapMove);
      }
      
      // Inform the parent that the map is ready
      if (onMapReady) {
        onMapReady(map);
      }
    }
    
    // Clean up event listeners when component unmounts
    return () => {
      if (map) {
        if (onMapClick) map.off('click', onMapClick);
        if (onMapDoubleClick) map.off('dblclick', onMapDoubleClick);
        if (onMapMove) map.off('mousemove', onMapMove);
      }
    };
  }, [map, onMapClick, onMapDoubleClick, onMapMove, onMapReady]);

  return null; // This component doesn't render anything
};

export default MapInitializer;
