
import { useState, useCallback, RefObject, useEffect } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { DEFAULT_LOCATION } from './mapConstants';
import { useMapDiagnostics } from './useMapDiagnostics';

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
  const [isMounted, setIsMounted] = useState(true);
  const [initAttempts, setInitAttempts] = useState(0);

  // Diagnostic
  const {
    diagnosticInfo,
    collectDiagnostics,
    getDiagnosticInfo,
    updateDiagnostics,
    setDiagnosticInfo
  } = useMapDiagnostics(mapRef);

  useEffect(() => {
    setIsMounted(true);
    collectDiagnostics();
    return () => setIsMounted(false);
  }, [collectDiagnostics]);

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
      updateDiagnostics({ containerDimensions });

      setTimeout(() => {
        try {
          if (!isMounted) return;
          if (!mapRef.current) {
            throw new Error('Map container lost during initialization');
          }

          // Dimension check & force if invalid
          if (mapRef.current.clientWidth < 10 || mapRef.current.clientHeight < 10) {
            mapRef.current.style.width = '100%';
            mapRef.current.style.height = '500px';
            updateDiagnostics({
              containerDimensions: `${mapRef.current?.clientWidth || 0}x${mapRef.current?.clientHeight || 0} (forced)`
            });
          }

          const newMap = L.map(mapRef.current, {
            preferCanvas: true,
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: false,
            zoomAnimation: true,
            inertia: false,
            markerZoomAnimation: false
          }).setView([useLocation.lat, useLocation.lng], 18);

          newMap.on('load', () => {
            const endTime = performance.now();
            updateDiagnostics({ initializationTime: Math.round(endTime - startTime) });
          });

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
                updateDiagnostics({ tilesLoaded: true });
                resolve();
              });
              tileLayer.on('error', (e) => {
                console.error('Tile layer error:', e);
                reject(new Error('Erreur de chargement des tuiles de carte'));
              });
              tileLayer.addTo(newMap);
              setTimeout(resolve, 3000);
            } catch (e) {
              reject(e);
            }
          });

          tileLayerPromise.catch(error => {
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

          newMap.once('load', () => {
            if (isMounted && onLoadComplete) onLoadComplete();
          });
          newMap.once('layeradd', () => {});

          setTimeout(() => {
            if (!isMounted) return;
            try {
              newMap.invalidateSize({ animate: false, pan: false });
              setMapState({
                map: newMap,
                isLoading: false,
                mapError: null
              });
              logDiagnostics();
              setTimeout(() => {
                if (isMounted && onLoadComplete) onLoadComplete();
              }, 1000);
            } catch (err) {
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
    setInitAttempts(prev => prev + 1);
  }, [lat, lng, mapRef, handleMapClick, mapState.map, onLoadComplete, isMounted, initAttempts, logDiagnostics, updateDiagnostics]);

  const forceReload = useCallback(() => {
    if (mapState.map) {
      mapState.map.off();
      mapState.map.remove();

      setMapState(prev => ({
        ...prev,
        map: null,
        isLoading: true,
        mapError: null
      }));

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
    setMapState,
    getDiagnosticInfo
  };
};
