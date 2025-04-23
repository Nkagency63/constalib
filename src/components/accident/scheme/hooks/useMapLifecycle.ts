
import { useEffect, useState } from 'react';
import { UseMapInitializationReturn } from './useMapInitialization';
import { toast } from 'sonner';

interface UseMapLifecycleProps {
  mapReady: boolean;
  setMapReady: (ready: boolean) => void;
  mapLoaded: boolean;
  setMapLoaded: (loaded: boolean) => void;
  mapRef: React.RefObject<HTMLDivElement>;
  map: L.Map | null;
  initializeMap: () => void;
  handleMapLoaded: () => void;
}

export const useMapLifecycle = ({
  mapReady,
  setMapReady,
  mapLoaded,
  setMapLoaded,
  mapRef,
  map,
  initializeMap,
  handleMapLoaded,
}: UseMapLifecycleProps) => {
  // Initialiser l'état de préparation de la carte après un délai
  useEffect(() => {
    if (!mapReady) {
      const timer = setTimeout(() => setMapReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [mapReady, setMapReady]);

  // Initialiser la carte une fois qu'elle est prête
  useEffect(() => {
    if (!mapReady) return;
    let timer: NodeJS.Timeout;
    
    if (mapRef.current) {
      timer = setTimeout(() => {
        initializeMap();
      }, 500);
    }
    
    return () => {
      clearTimeout(timer);
      if (map) {
        map.off();
        map.remove();
      }
    };
  }, [mapReady, initializeMap, map, mapRef]);
};
