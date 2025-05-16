
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
  const boundEventHandlersRef = useRef<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    // Vérifier que la carte est bien initialisée et éviter les initialisations multiples
    if (!map || initDoneRef.current) return;
    
    try {
      console.log("Map initializer: map object is ready");
      initDoneRef.current = true;
      
      // Forcer invalidateSize avec un délai pour assurer un rendu correct
      setTimeout(() => {
        if (!map) {
          console.error("Map object is null or undefined after timeout");
          return;
        }
        
        try {
          // S'assurer que invalidateSize existe avant de l'appeler
          if (typeof map.invalidateSize === 'function') {
            console.log("Invalidating map size");
            map.invalidateSize(true);
          }
          
          // Associer les gestionnaires d'événements de manière sécurisée
          // Vérifier que chaque méthode existe avant de l'appeler
          if (onMapClick && typeof map.on === 'function' && !boundEventHandlersRef.current.click) {
            map.on('click', (e) => {
              if (onMapClick) onMapClick(e.latlng);
            });
            boundEventHandlersRef.current.click = true;
            console.log("Map click handler registered");
          }
          
          if (onMapDoubleClick && typeof map.on === 'function' && !boundEventHandlersRef.current.dblclick) {
            map.on('dblclick', (e) => {
              // Empêcher le comportement de zoom par défaut
              if (L.DomEvent && L.DomEvent.stopPropagation) {
                L.DomEvent.stopPropagation(e);
              }
              if (onMapDoubleClick) onMapDoubleClick();
              console.log("Map double click handled");
            });
            boundEventHandlersRef.current.dblclick = true;
          }
          
          if (onMapMove && typeof map.on === 'function' && !boundEventHandlersRef.current.mousemove) {
            map.on('mousemove', (e) => {
              if (onMapMove) onMapMove(e.latlng);
            });
            boundEventHandlersRef.current.mousemove = true;
          }
          
          if (setCenter && typeof map.on === 'function' && !boundEventHandlersRef.current.moveend) {
            map.on('moveend', () => {
              if (setCenter && map.getCenter) {
                const center = map.getCenter();
                setCenter([center.lat, center.lng] as [number, number]);
              }
            });
            boundEventHandlersRef.current.moveend = true;
          }
          
          if (setZoom && typeof map.on === 'function' && !boundEventHandlersRef.current.zoomend) {
            map.on('zoomend', () => {
              if (setZoom && map.getZoom) setZoom(map.getZoom());
            });
            boundEventHandlersRef.current.zoomend = true;
          }
          
          // Appeler le callback onMapReady s'il est fourni
          if (onMapReady && map) {
            console.log("Calling onMapReady callback");
            onMapReady(map);
          }
        } catch (error) {
          console.error("Error in map initialization:", error);
        }
      }, 300);
      
    } catch (error) {
      console.error("Error in map initialization:", error);
    }
    
    // Nettoyer les gestionnaires d'événements lors du démontage
    return () => {
      try {
        // Ne nettoyer que si la carte est valide et que nous avons attaché des événements
        if (map && typeof map.off === 'function' && Object.keys(boundEventHandlersRef.current).length > 0) {
          console.log("Map initializer: safely cleaning up");
          
          // Retirer uniquement les gestionnaires que nous avons explicitement ajoutés
          if (boundEventHandlersRef.current.click && typeof map.off === 'function') map.off('click');
          if (boundEventHandlersRef.current.dblclick && typeof map.off === 'function') map.off('dblclick');
          if (boundEventHandlersRef.current.mousemove && typeof map.off === 'function') map.off('mousemove');
          if (boundEventHandlersRef.current.moveend && typeof map.off === 'function') map.off('moveend');
          if (boundEventHandlersRef.current.zoomend && typeof map.off === 'function') map.off('zoomend');
          
          // Réinitialiser le suivi des événements liés
          boundEventHandlersRef.current = {};
        }
      } catch (error) {
        console.error("Error cleaning up map event handlers:", error);
      }
    };
  }, [map, onMapReady, setCenter, setZoom, onMapClick, onMapDoubleClick, onMapMove]);
  
  return null;
};

export default MapInitializer;
