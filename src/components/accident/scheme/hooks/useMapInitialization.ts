
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
  
  // Track diagnostic info
  const [diagnosticInfo, setDiagnosticInfo] = useState<{
    browserInfo: string;
    screenDimensions: string;
    containerDimensions: string;
    tilesLoaded: boolean;
    leafletVersion: string;
    initializationTime: number;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Collect basic diagnostic info
    const browserInfo = navigator.userAgent;
    const screenDimensions = `${window.innerWidth}x${window.innerHeight}`;
    const leafletVersion = L.version || 'unknown';
    
    setDiagnosticInfo(prev => ({
      ...prev,
      browserInfo,
      screenDimensions,
      leafletVersion,
      containerDimensions: mapRef.current ? 
        `${mapRef.current.clientWidth}x${mapRef.current.clientHeight}` : 
        'unknown',
      tilesLoaded: false,
      initializationTime: 0
    }));
    
    return () => setIsMounted(false);
  }, []);

  const logDiagnostics = () => {
    if (diagnosticInfo) {
      console.group('🗺️ Map Diagnostic Information');
      console.log('Browser Info:', diagnosticInfo.browserInfo);
      console.log('Screen Dimensions:', diagnosticInfo.screenDimensions);
      console.log('Container Dimensions:', diagnosticInfo.containerDimensions);
      console.log('Leaflet Version:', diagnosticInfo.leafletVersion);
      console.log('Tiles Loaded:', diagnosticInfo.tilesLoaded);
      console.log('Initialization Time:', `${diagnosticInfo.initializationTime}ms`);
      console.groupEnd();
    }
  };

  const initializeMap = useCallback(() => {
    if (!isMounted) return;
    
    const startTime = performance.now();
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
      
      const containerDimensions = `${mapRef.current.clientWidth}x${mapRef.current.clientHeight}`;
      console.log('Map container dimensions:', containerDimensions);
      
      // Update diagnostic info
      setDiagnosticInfo(prev => prev ? {
        ...prev,
        containerDimensions
      } : null);
      
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
            
            // Update diagnostic info after forced resize
            setDiagnosticInfo(prev => prev ? {
              ...prev,
              containerDimensions: `${mapRef.current?.clientWidth || 0}x${mapRef.current?.clientHeight || 0} (forced)`
            } : null);
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
          
          // Add event listeners for diagnostic purposes
          newMap.on('load', () => {
            const endTime = performance.now();
            const loadTime = Math.round(endTime - startTime);
            console.log(`Map loaded in ${loadTime}ms`);
            
            setDiagnosticInfo(prev => prev ? {
              ...prev,
              initializationTime: loadTime
            } : null);
          });
          
          // Add tile layer with timeout to handle connection issues
          const tileLayerPromise = new Promise<void>((resolve, reject) => {
            try {
              const tileLoadStartTime = performance.now();
              let tilesLoaded = 0;
              
              const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
                minZoom: 15,
              });
              
              tileLayer.on('tileloadstart', () => {
                tilesLoaded++;
                if (tilesLoaded === 1) {
                  console.log('First tile load started');
                }
              });
              
              tileLayer.on('tileload', () => {
                if (tilesLoaded === 1) {
                  const tileLoadTime = Math.round(performance.now() - tileLoadStartTime);
                  console.log(`First tile loaded in ${tileLoadTime}ms`);
                }
              });
              
              tileLayer.on('load', () => {
                const tileLoadTime = Math.round(performance.now() - tileLoadStartTime);
                console.log(`Tile layer fully loaded in ${tileLoadTime}ms`);
                
                setDiagnosticInfo(prev => prev ? {
                  ...prev,
                  tilesLoaded: true
                } : null);
                
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
              logDiagnostics();
              
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
  }, [lat, lng, mapRef, handleMapClick, mapState.map, onLoadComplete, isMounted, initAttempts, logDiagnostics]);

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

  // Function to get diagnostic information
  const getDiagnosticInfo = useCallback(() => {
    if (!diagnosticInfo) return 'Information de diagnostic non disponible';
    
    return `
      Navigateur: ${diagnosticInfo.browserInfo.substring(0, 50)}...
      Écran: ${diagnosticInfo.screenDimensions}
      Conteneur carte: ${diagnosticInfo.containerDimensions}
      Version Leaflet: ${diagnosticInfo.leafletVersion}
      Tuiles chargées: ${diagnosticInfo.tilesLoaded ? 'Oui' : 'Non'}
      Temps d'initialisation: ${diagnosticInfo.initializationTime}ms
    `;
  }, [diagnosticInfo]);

  return {
    ...mapState,
    initializeMap,
    forceReload,
    initAttempts,
    setMapState,
    getDiagnosticInfo
  };
};
