
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
          map.invalidateSize();
          
          // Configurer les gestionnaires d'événements
          if (onMapClick) {
            map.on('click', (e) => onMapClick(e.latlng));
          }
          
          if (onMapDoubleClick) {
            map.on('dblclick', (e) => {
              // Empêcher le comportement de zoom par défaut
              L.DomEvent.stopPropagation(e);
              onMapDoubleClick();
            });
          }
          
          if (onMapMove) {
            map.on('mousemove', (e) => onMapMove(e.latlng));
          }
          
          if (setCenter) {
            map.on('moveend', () => {
              setCenter([map.getCenter().lat, map.getCenter().lng] as [number, number]);
            });
          }
          
          if (setZoom) {
            map.on('zoomend', () => setZoom(map.getZoom()));
          }
          
          // Appeler le callback onMapReady s'il est fourni
          if (onMapReady) {
            onMapReady(map);
          }
          
        }, 300); // Délai pour une meilleure réactivité
      } catch (error) {
        console.error("Error in map initialization:", error);
      }
    }
    
    return () => {
      try {
        console.log("Map initializer: safely cleaning up");
        
        // Nettoyage des événements sans supprimer les contrôles
        if (map) {
          if (onMapClick) map.off('click');
          if (onMapDoubleClick) map.off('dblclick');
          if (onMapMove) map.off('mousemove');
          if (setCenter) map.off('moveend');
          if (setZoom) map.off('zoomend');
        }
      } catch (error) {
        console.error("Error cleaning up map:", error);
      }
    };
  }, [map, onMapReady, setCenter, setZoom, onMapClick, onMapDoubleClick, onMapMove]);
  
  return null;
};

export default MapInitializer;
