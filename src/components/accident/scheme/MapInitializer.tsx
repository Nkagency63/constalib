
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
    if (!map || initDoneRef.current) return;
    
    try {
      console.log("Map initializer: map object is ready");
      initDoneRef.current = true;
      
      // Forcer invalidateSize pour assurer un rendu correct
      setTimeout(() => {
        if (!map) return;
        
        map.invalidateSize();
        
        // Configurer les gestionnaires d'événements de manière sécurisée
        if (onMapClick && !boundEventHandlersRef.current.click) {
          map.on('click', (e) => onMapClick(e.latlng));
          boundEventHandlersRef.current.click = true;
        }
        
        if (onMapDoubleClick && !boundEventHandlersRef.current.dblclick) {
          map.on('dblclick', (e) => {
            // Empêcher le comportement de zoom par défaut
            L.DomEvent.stopPropagation(e);
            onMapDoubleClick();
          });
          boundEventHandlersRef.current.dblclick = true;
        }
        
        if (onMapMove && !boundEventHandlersRef.current.mousemove) {
          map.on('mousemove', (e) => onMapMove(e.latlng));
          boundEventHandlersRef.current.mousemove = true;
        }
        
        if (setCenter && !boundEventHandlersRef.current.moveend) {
          map.on('moveend', () => {
            setCenter([map.getCenter().lat, map.getCenter().lng] as [number, number]);
          });
          boundEventHandlersRef.current.moveend = true;
        }
        
        if (setZoom && !boundEventHandlersRef.current.zoomend) {
          map.on('zoomend', () => setZoom(map.getZoom()));
          boundEventHandlersRef.current.zoomend = true;
        }
        
        // Appeler le callback onMapReady s'il est fourni
        if (onMapReady) {
          onMapReady(map);
        }
      }, 300);
      
    } catch (error) {
      console.error("Error in map initialization:", error);
    }
    
    return () => {
      try {
        // Only clean up if map is valid and we've attached events
        if (map && Object.keys(boundEventHandlersRef.current).length > 0) {
          console.log("Map initializer: safely cleaning up");
          
          // Remove event listeners safely
          if (boundEventHandlersRef.current.click) map.off('click');
          if (boundEventHandlersRef.current.dblclick) map.off('dblclick');
          if (boundEventHandlersRef.current.mousemove) map.off('mousemove');
          if (boundEventHandlersRef.current.moveend) map.off('moveend');
          if (boundEventHandlersRef.current.zoomend) map.off('zoomend');
          
          // Reset the bound events tracking
          boundEventHandlersRef.current = {};
        }
      } catch (error) {
        console.error("Error cleaning up map:", error);
      }
    };
  }, [map, onMapReady, setCenter, setZoom, onMapClick, onMapDoubleClick, onMapMove]);
  
  return null;
};

export default MapInitializer;
