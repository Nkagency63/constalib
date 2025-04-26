
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { SchemeData, Vehicle } from '../types';
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
    
    // Remove the zoom control as we'll use our custom one
    map.removeControl(map.zoomControl);
    
    initializeScheme();
  };

  const centerOnVehicles = (vehicles: Vehicle[]) => {
    if (!mapRef.current || vehicles.length === 0) return;
    
    if (vehicles.length === 1) {
      // If there's only one vehicle, center on it with a reasonable zoom
      const position = L.latLng(vehicles[0].position[0], vehicles[0].position[1]);
      mapRef.current.setView(position, 18);
      return;
    }
    
    // Create bounds from all vehicle positions
    const bounds = L.latLngBounds(
      vehicles.map(v => L.latLng(v.position[0], v.position[1]))
    );
    
    // Fit the map to these bounds with padding
    mapRef.current.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: 18
    });
  };

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles
  };
};
