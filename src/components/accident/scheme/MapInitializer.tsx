
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
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (map) {
      // Retarder l'initialisation pour s'assurer que le DOM est prêt
      timerRef.current = window.setTimeout(() => {
        try {
          console.log("Map initializer: map object is ready");
          
          // Forcer invalidateSize pour assurer un rendu correct
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
            map.on('moveend', () => setCenter(
              [map.getCenter().lat, map.getCenter().lng] as [number, number]
            ));
          }
          
          if (setZoom) {
            map.on('zoomend', () => setZoom(map.getZoom()));
          }
          
          // Appeler le callback onMapReady s'il est fourni
          if (onMapReady) {
            onMapReady(map);
          }
        } catch (error) {
          console.error("Error in map initialization:", error);
        }
      }, 200); // Délai réduit pour une meilleure réactivité
      
      return () => {
        // Effacer le timeout lors du démontage
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        try {
          console.log("Map initializer: safely cleaning up");
          
          // Nettoyer les écouteurs d'événements que nous avons ajoutés, mais de manière sécurisée
          if (map) {
            // Nettoyage sécurisé sans accéder à des propriétés potentiellement inexistantes
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
    }
  }, [map, onMapReady, setCenter, setZoom, onMapClick, onMapDoubleClick, onMapMove]);
  
  return null;
};

export default MapInitializer;
