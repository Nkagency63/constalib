
import { useState, useCallback, RefObject, useEffect } from 'react';
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
  
  // Track if component is mounted to avoid memory leaks
  const [isMounted, setIsMounted] = useState(true);
  
  // Track initialization attempts
  const [initAttempts, setInitAttempts] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const initializeMap = useCallback(() => {
    if (!isMounted) return;
    
    console.log('initializeMap called, mapRef exists:', !!mapRef.current, 'attempt:', initAttempts + 1);
    
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
      if (!isMounted) return;
      
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
      
      // Give the DOM some time to be ready
      setTimeout(() => {
        try {
          if (!isMounted) return;
          
          if (!mapRef.current) {
            throw new Error('Map container lost during initialization');
          }
          
          // Check if container has valid dimensions
          if (mapRef.current.clientWidth < 10 || mapRef.current.clientHeight < 10) {
            console.warn('Map container has invalid dimensions:', mapRef.current.clientWidth, 'x', mapRef.current.clientHeight);
            // Force dimensions if needed
            mapRef.current.style.width = '100%';
            mapRef.current.style.height = '500px';
          }
          
          console.log('Creating map instance with dimensions:', mapRef.current.clientWidth, 'x', mapRef.current.clientHeight);
          
          const newMap = L.map(mapRef.current, {
            preferCanvas: true,
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: false,
            zoomAnimation: true, // Enable zoom animation for smoother experience
            inertia: false,
            markerZoomAnimation: false
          }).setView([useLocation.lat, useLocation.lng], 18);
          
          // Add tile layer with timeout to handle connection issues
          const tileLayerPromise = new Promise<void>((resolve, reject) => {
            try {
              const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
                minZoom: 15,
              });
              
              tileLayer.on('load', () => {
                console.log('Tile layer loaded');
                resolve();
              });
              
              tileLayer.on('error', (e) => {
                console.error('Tile layer error:', e);
                reject(new Error('Erreur de chargement des tuiles de carte'));
              });
              
              tileLayer.addTo(newMap);
              
              // Set a timeout in case the load event doesn't fire
              setTimeout(resolve, 3000);
            } catch (e) {
              reject(e);
            }
          });
          
          tileLayerPromise.catch(error => {
            console.error('Tile layer promise error:', error);
            if (isMounted) {
              setMapState({
                map: null,
                isLoading: false,
                mapError: 'Erreur de chargement des tuiles de carte'
              });
              
              toast('Erreur de carte', {
                description: 'Impossible de charger les tuiles de carte. Vérifiez votre connexion internet.',
              });
            }
          });

          if (lat && lng) {
            L.marker([lat, lng]).addTo(newMap);
          }
          
          newMap.on('click', handleMapClick);
          
          // Multiple ways to detect when map is ready
          newMap.once('load', () => {
            console.log('Map load event fired');
            if (isMounted && onLoadComplete) onLoadComplete();
          });
          
          newMap.once('layeradd', () => {
            console.log('Map layeradd event fired');
          });
          
          // Force a redraw of the map container
          setTimeout(() => {
            if (!isMounted) return;
            
            try {
              newMap.invalidateSize({ animate: false, pan: false });
              console.log('invalidateSize called');
              
              if (isMounted) {
                setMapState({
                  map: newMap,
                  isLoading: false,
                  mapError: null
                });
              }
              
              console.log('Map initialized successfully');
              
              // Even if the load event doesn't fire, consider it loaded after a timeout
              setTimeout(() => {
                if (isMounted && onLoadComplete) onLoadComplete();
              }, 1000);
            } catch (err) {
              console.error('Error during map initialization final steps:', err);
              if (isMounted) {
                setMapState({
                  map: null,
                  isLoading: false,
                  mapError: 'Erreur lors de la finalisation de la carte'
                });
                
                toast('Erreur de carte', {
                  description: 'La carte a été créée mais n\'a pas pu être finalisée. Veuillez réessayer.',
                });
              }
            }
          }, 300);
          
        } catch (innerError) {
          console.error('Error during map creation:', innerError);
          if (isMounted) {
            setMapState({
              map: null,
              isLoading: false,
              mapError: 'Erreur lors de la création de la carte'
            });
            
            toast('Erreur de carte', {
              description: 'Impossible d\'initialiser la carte. Veuillez réessayer.',
            });
          }
        }
      }, 500);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      if (isMounted) {
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
    }
    
    // Increment attempt counter
    setInitAttempts(prev => prev + 1);
  }, [lat, lng, mapRef, handleMapClick, mapState.map, onLoadComplete, isMounted, initAttempts]);

  // Provide a clean way to force map reinitialization
  const forceReload = useCallback(() => {
    if (mapState.map) {
      console.log('Forcing map reload...');
      mapState.map.off();
      mapState.map.remove();
      
      setMapState(prev => ({
        ...prev,
        map: null,
        isLoading: true,
        mapError: null
      }));
      
      // Use a slight delay to ensure DOM updates before reinitialization
      setTimeout(() => {
        if (isMounted) {
          initializeMap();
        }
      }, 300);
    } else {
      initializeMap();
    }
  }, [mapState.map, initializeMap, isMounted]);

  return {
    ...mapState,
    initializeMap,
    forceReload,
    initAttempts,
    setMapState
  };
};
