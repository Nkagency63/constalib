
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
  const eventHandlersSetRef = useRef(false);
  
  useEffect(() => {
    if (!map || initDoneRef.current) return;
    
    // Mark initialization as done to avoid duplicate calls
    initDoneRef.current = true;
    
    try {
      console.log("Map initializer: map object is ready");
      
      // Force invalidateSize to ensure proper rendering
      setTimeout(() => {
        try {
          if (map) {
            console.log("Invalidating map size");
            map.invalidateSize(true);
            
            // Set up event handlers only if they haven't been set up already
            if (!eventHandlersSetRef.current) {
              eventHandlersSetRef.current = true;
              
              if (onMapClick) {
                console.log("Setting up map click handler");
                map.on('click', (e) => onMapClick(e.latlng));
              }
              
              if (onMapDoubleClick) {
                map.on('dblclick', (e) => {
                  // Prevent default zoom behavior
                  L.DomEvent.stopPropagation(e);
                  onMapDoubleClick();
                });
              }
              
              if (onMapMove) {
                map.on('mousemove', (e) => onMapMove(e.latlng));
              }
              
              if (setCenter) {
                map.on('moveend', () => {
                  const center: [number, number] = [
                    map.getCenter().lat,
                    map.getCenter().lng
                  ];
                  setCenter(center);
                });
              }
              
              if (setZoom) {
                map.on('zoomend', () => setZoom(map.getZoom()));
              }
            }
            
            // Call onMapReady callback if provided
            if (onMapReady) {
              console.log("Calling onMapReady callback");
              onMapReady(map);
            }
          }
        } catch (error) {
          console.error("Error in map timeout callback:", error);
        }
      }, 300); // Delay for better reactivity
    } catch (error) {
      console.error("Error in map initialization:", error);
    }
    
    return () => {
      // Clean up event handlers to avoid memory leaks
      try {
        if (map && map.getContainer && map.getContainer()) {
          console.log("Map initializer: safely cleaning up");
          
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
