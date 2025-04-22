
import { useState, useCallback, RefObject } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';

interface UseMapInitializationProps {
  mapRef: RefObject<HTMLDivElement>;
  lat: number | null;
  lng: number | null;
  handleMapClick: (e: L.LeafletMouseEvent) => void;
  onLoadComplete?: () => void;
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

// Fix for default icon issue in Leaflet with webpack/vite
// We need to redefine the default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const useMapInitialization = ({ 
  mapRef, 
  lat, 
  lng, 
  handleMapClick,
  onLoadComplete
}: UseMapInitializationProps) => {
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    isLoading: true,
    mapError: null
  });

  const initializeMap = useCallback(() => {
    console.log('initializeMap called, mapRef exists:', !!mapRef.current);
    
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
      setMapState(prev => ({ ...prev, isLoading: true, mapError: null }));
      
      if (mapState.map) {
        console.log('Cleaning up previous map instance');
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
      
      // Small delay to ensure the DOM is ready
      setTimeout(() => {
        try {
          if (!mapRef.current) {
            throw new Error('Map container lost during initialization');
          }
          
          const newMap = L.map(mapRef.current, {
            preferCanvas: true,
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: false,
            zoomAnimation: false,
            inertia: false,
            markerZoomAnimation: false
          }).setView([useLocation.lat, useLocation.lng], 18);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
            minZoom: 15,
          }).addTo(newMap);

          if (lat && lng) {
            L.marker([lat, lng]).addTo(newMap);
          }
          
          newMap.on('click', handleMapClick);
          
          // Ensure the map is properly loaded and rendered before completing
          newMap.once('load', () => {
            console.log('Map load event fired');
            if (onLoadComplete) onLoadComplete();
          });
          
          // Force a redraw of the map container
          newMap.invalidateSize();
          
          setMapState({
            map: newMap,
            isLoading: false,
            mapError: null
          });
          
          console.log('Map initialized successfully');
          
          // Even if the load event doesn't fire, consider it loaded after a timeout
          setTimeout(() => {
            if (onLoadComplete) onLoadComplete();
          }, 1000);
        } catch (innerError) {
          console.error('Error during map creation:', innerError);
          setMapState({
            map: null,
            isLoading: false,
            mapError: 'Erreur lors de la création de la carte'
          });
          
          toast('Erreur de carte', {
            description: 'Impossible d\'initialiser la carte. Veuillez réessayer.',
          });
        }
      }, 100);
      
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
  }, [lat, lng, mapRef, handleMapClick, mapState.map, onLoadComplete]);

  return {
    ...mapState,
    initializeMap,
    setMapState
  };
};
