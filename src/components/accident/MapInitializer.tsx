
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapInitializerProps {
  onMapReady?: (map: L.Map) => void;
  setCenter?: (center: [number, number]) => void;
  setZoom?: (zoom: number) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  onMapDoubleClick?: () => void;
  onMapMove?: (latlng: L.LatLng) => void;
}

const MapInitializer: React.FC<MapInitializerProps> = ({
  onMapReady,
  setCenter,
  setZoom,
  onMapClick,
  onMapDoubleClick,
  onMapMove
}) => {
  const map = useMap();
  const initDoneRef = useRef(false);
  
  useEffect(() => {
    if (map && !initDoneRef.current) {
      // Marquer l'initialisation comme terminée pour éviter les appels dupliqués
      initDoneRef.current = true;
      
      try {
        console.log("Map initializer: map object is ready");
        
        // Forcer invalidateSize pour assurer un rendu correct
        setTimeout(() => {
          if (map) {
            map.invalidateSize();
            
            // Configurer les gestionnaires d'événements
            if (onMapClick) {
              map.off('click'); // Remove any existing handlers first
              map.on('click', (e) => onMapClick(e.latlng));
            }
            
            if (onMapDoubleClick) {
              map.off('dblclick'); // Remove any existing handlers first
              map.on('dblclick', (e) => {
                // Empêcher le comportement de zoom par défaut
                L.DomEvent.stopPropagation(e);
                onMapDoubleClick();
              });
            }
            
            if (onMapMove) {
              map.off('mousemove'); // Remove any existing handlers first
              map.on('mousemove', (e) => onMapMove(e.latlng));
            }
            
            if (setCenter) {
              map.off('moveend'); // Remove any existing handlers first
              map.on('moveend', () => {
                setCenter([map.getCenter().lat, map.getCenter().lng] as [number, number]);
              });
            }
            
            if (setZoom) {
              map.off('zoomend'); // Remove any existing handlers first
              map.on('zoomend', () => setZoom(map.getZoom()));
            }
            
            // Call onMapReady callback if provided
            if (onMapReady) {
              onMapReady(map);
            }
          }
        }, 300); // Délai pour une meilleure réactivité
      } catch (error) {
        console.error("Error in map initialization:", error);
      }
    }
    
    return () => {
      // Clean up event handlers to avoid memory leaks
      if (map) {
        console.log("Map initializer: safely cleaning up");
        if (onMapClick) map.off('click');
        if (onMapDoubleClick) map.off('dblclick');
        if (onMapMove) map.off('mousemove');
        if (setCenter) map.off('moveend');
        if (setZoom) map.off('zoomend');
      }
    };
  }, [map, onMapReady, setCenter, setZoom, onMapClick, onMapDoubleClick, onMapMove]);
  
  return null;
};

export default MapInitializer;
