
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
      
      // Force invalidateSize with a delay to ensure proper rendering
      setTimeout(() => {
        if (!map) {
          console.error("Map object is null or undefined after timeout");
          return;
        }
        
        try {
          console.log("Invalidating map size");
          map.invalidateSize(true);
          
          // Configure event handlers safely
          if (onMapClick && !boundEventHandlersRef.current.click) {
            map.on('click', (e) => onMapClick(e.latlng));
            boundEventHandlersRef.current.click = true;
            console.log("Map click handler registered");
          }
          
          if (onMapDoubleClick && !boundEventHandlersRef.current.dblclick) {
            map.on('dblclick', (e) => {
              // Prevent default zoom behavior
              L.DomEvent.stopPropagation(e);
              onMapDoubleClick();
              console.log("Map double click handled");
            });
            boundEventHandlersRef.current.dblclick = true;
          }
          
          if (onMapMove && !boundEventHandlersRef.current.mousemove) {
            map.on('mousemove', (e) => onMapMove(e.latlng));
            boundEventHandlersRef.current.mousemove = true;
          }
          
          if (setCenter && !boundEventHandlersRef.current.moveend) {
            map.on('moveend', () => {
              const center = map.getCenter();
              setCenter([center.lat, center.lng] as [number, number]);
            });
            boundEventHandlersRef.current.moveend = true;
          }
          
          if (setZoom && !boundEventHandlersRef.current.zoomend) {
            map.on('zoomend', () => setZoom(map.getZoom()));
            boundEventHandlersRef.current.zoomend = true;
          }
          
          // Call the callback onMapReady if provided
          if (onMapReady) {
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
    
    return () => {
      try {
        // Only clean up if map is valid and we've attached events
        if (map && typeof map.off === 'function' && Object.keys(boundEventHandlersRef.current).length > 0) {
          console.log("Map initializer: safely cleaning up");
          
          // Remove event listeners safely
          if (boundEventHandlersRef.current.click && map.off) map.off('click');
          if (boundEventHandlersRef.current.dblclick && map.off) map.off('dblclick');
          if (boundEventHandlersRef.current.mousemove && map.off) map.off('mousemove');
          if (boundEventHandlersRef.current.moveend && map.off) map.off('moveend');
          if (boundEventHandlersRef.current.zoomend && map.off) map.off('zoomend');
          
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
