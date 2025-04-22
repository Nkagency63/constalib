
import { useState, useCallback, RefObject } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface UseMapInitializationProps {
  mapRef: RefObject<HTMLDivElement>;
  lat: number | null;
  lng: number | null;
  handleMapClick: (e: L.LeafletMouseEvent) => void;
}

interface MapState {
  map: L.Map | null;
  isLoading: boolean;
  mapError: string | null;
}

const DEFAULT_LOCATION = {
  lat: 48.8566, // Paris as default location
  lng: 2.3522
};

export const useMapInitialization = ({ 
  mapRef, 
  lat, 
  lng, 
  handleMapClick 
}: UseMapInitializationProps) => {
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    isLoading: true,
    mapError: null
  });

  const initializeMap = useCallback(() => {
    if (!mapRef.current) {
      console.error('Map container reference not found');
      setMapState(prev => ({
        ...prev,
        mapError: 'Conteneur de carte introuvable',
        isLoading: false
      }));
      return;
    }
    
    try {
      setMapState(prev => ({ ...prev, mapError: null }));
      
      if (mapState.map) {
        mapState.map.off();
        mapState.map.remove();
      }
      
      const useLocation = {
        lat: lat || DEFAULT_LOCATION.lat,
        lng: lng || DEFAULT_LOCATION.lng
      };
      
      console.log('Initializing map at coordinates:', useLocation);
      console.log('Map container element ID:', mapRef.current.id);
      console.log('Map container dimensions:', mapRef.current.clientWidth, 'x', mapRef.current.clientHeight);
      
      const newMap = L.map(mapRef.current, {
        preferCanvas: true,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: false,
        inertia: false,
        markerZoomAnimation: false
      }).setView([useLocation.lat, useLocation.lng], 18);
      
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 15,
      }).addTo(newMap);

      if (lat && lng) {
        L.marker([lat, lng]).addTo(newMap);
      }
      
      newMap.on('click', handleMapClick);
      
      setMapState({
        map: newMap,
        isLoading: false,
        mapError: null
      });
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapState({
        map: null,
        isLoading: false,
        mapError: 'Erreur d\'initialisation de la carte'
      });
      
      if (mapRef.current) {
        console.log('Map container state when error occurred:', {
          id: mapRef.current.id,
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight,
          innerHTML: mapRef.current.innerHTML.substring(0, 100) + '...',
          isConnected: mapRef.current.isConnected
        });
      }
      
      toast('Erreur de carte', {
        description: 'Impossible d\'initialiser la carte. Veuillez réessayer.',
      });
    }
  }, [lat, lng, mapRef, handleMapClick, mapState.map]);

  return {
    ...mapState,
    initializeMap,
    setMapState
  };
};
