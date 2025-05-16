
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
    // Safely handle map initialization
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
          
          // Safely set up event handlers
          if (onMapClick && typeof map.on === 'function' && !boundEventHandlersRef.current.click) {
            map.on('click', (e) => {
              if (onMapClick) onMapClick(e.latlng);
            });
            boundEventHandlersRef.current.click = true;
            console.log("Map click handler registered");
          }
          
          if (onMapDoubleClick && typeof map.on === 'function' && !boundEventHandlersRef.current.dblclick) {
            map.on('dblclick', (e) => {
              if (L.DomEvent && L.DomEvent.stopPropagation) {
                // Prevent default zoom behavior
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
              if (setCenter) {
                const center = map.getCenter();
                setCenter([center.lat, center.lng] as [number, number]);
              }
            });
            boundEventHandlersRef.current.moveend = true;
          }
          
          if (setZoom && typeof map.on === 'function' && !boundEventHandlersRef.current.zoomend) {
            map.on('zoomend', () => {
              if (setZoom) setZoom(map.getZoom());
            });
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
    
    // Clean up event handlers on unmount
    return () => {
      try {
        // Only clean up if map is valid and we've attached events
        if (map && typeof map.off === 'function' && Object.keys(boundEventHandlersRef.current).length > 0) {
          console.log("Map initializer: safely cleaning up");
          
          // Only remove handlers we've explicitly added
          if (boundEventHandlersRef.current.click) map.off('click');
          if (boundEventHandlersRef.current.dblclick) map.off('dblclick');
          if (boundEventHandlersRef.current.mousemove) map.off('mousemove');
          if (boundEventHandlersRef.current.moveend) map.off('moveend');
          if (boundEventHandlersRef.current.zoomend) map.off('zoomend');
          
          // Reset the bound events tracking
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
