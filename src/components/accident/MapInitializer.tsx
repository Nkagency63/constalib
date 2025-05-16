
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
          
          // Safely bind event handlers
          if (onMapClick && typeof map.on === 'function' && !boundEventHandlersRef.current.click) {
            map.on('click', (e) => {
              if (onMapClick) onMapClick(e.latlng);
            });
            boundEventHandlersRef.current.click = true;
            console.log("Map click handler registered");
          }
          
          if (onMapDoubleClick && typeof map.on === 'function' && !boundEventHandlersRef.current.dblclick) {
            map.on('dblclick', (e) => {
              if (L.DomEvent && typeof L.DomEvent.stopPropagation === 'function') {
                L.DomEvent.stopPropagation(e);
              }
              if (onMapDoubleClick) onMapDoubleClick();
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
              if (setCenter && typeof map.getCenter === 'function') {
                const center = map.getCenter();
                setCenter([center.lat, center.lng] as [number, number]);
              }
            });
            boundEventHandlersRef.current.moveend = true;
          }
          
          if (setZoom && typeof map.on === 'function' && !boundEventHandlersRef.current.zoomend) {
            map.on('zoomend', () => {
              if (setZoom && typeof map.getZoom === 'function') {
                setZoom(map.getZoom());
              }
            });
            boundEventHandlersRef.current.zoomend = true;
          }
          
          // Call onMapReady callback if provided
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
    
    // Clean up event handlers on unmount
    return () => {
      try {
        if (map && typeof map.off === 'function') {
          console.log("Map initializer: safely cleaning up");
          
          // Only remove handlers we explicitly added
          const handlers = boundEventHandlersRef.current;
          if (handlers.click) map.off('click');
          if (handlers.dblclick) map.off('dblclick');
          if (handlers.mousemove) map.off('mousemove');
          if (handlers.moveend) map.off('moveend');
          if (handlers.zoomend) map.off('zoomend');
          
          // Reset handler tracking
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
