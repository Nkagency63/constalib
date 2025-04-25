
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { SchemeData } from '../types';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export const useSchemeMap = (
  readOnly: boolean,
  handleMapClick: (e: L.LeafletMouseEvent) => void,
  initializeScheme: () => void
) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    drawingLayerRef.current = L.layerGroup().addTo(map);
    
    if (!readOnly) {
      map.on('click', handleMapClick);
    }
    
    initializeScheme();
  };

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady
  };
};
