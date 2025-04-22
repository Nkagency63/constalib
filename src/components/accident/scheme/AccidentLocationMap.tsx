
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useVehicleScheme } from './useVehicleScheme';
import { useMapInitialization } from './hooks/useMapInitialization';
import VehicleIcon from './VehicleIcon';
import MapControls from './components/MapControls';
import MapError from './components/MapError';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface AccidentLocationMapProps {
  lat: number | null;
  lng: number | null;
  address: string;
}

const AccidentLocationMap = ({ lat, lng, address }: AccidentLocationMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  const [showDiagnosticDialog, setShowDiagnosticDialog] = useState(false);
  
  const {
    vehicles,
    selectedVehicle,
    isDragging,
    zoom,
    historyIndex,
    history,
    setSelectedVehicle,
    setIsDragging,
    addVehicle,
    updateVehiclePosition,
    rotateVehicle,
    removeVehicle,
    undo,
    redo,
    setZoom
  } = useVehicleScheme();

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (!isDragging || !selectedVehicle) return;
    const point = e.target.mouseEventToContainerPoint(e.originalEvent);
    updateVehiclePosition(selectedVehicle, point.x, point.y);
  }, [isDragging, selectedVehicle, updateVehiclePosition]);
  
  const handleMapLoaded = useCallback(() => {
    console.log('Map loaded callback triggered');
    setMapLoaded(true);
    
    // Notify user that map has loaded successfully
    toast('Carte chargée', {
      description: 'La carte a été chargée avec succès',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    });
  }, []);

  // Effect to set mapReady after mount
  useEffect(() => {
    // Use a short timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const { 
    map, 
    isLoading, 
    mapError, 
    initializeMap, 
    forceReload, 
    initAttempts, 
    setMapState,
    getDiagnosticInfo
  } = useMapInitialization({
    mapRef: mapContainerRef,
    lat,
    lng,
    handleMapClick,
    onLoadComplete: handleMapLoaded
  });

  // Initial map loading - only run once mapReady is true
  useEffect(() => {
    if (!mapReady) return;
    
    console.log('Initial map loading effect triggered, mapReady:', mapReady);
    console.log('Map container ref exists:', !!mapContainerRef.current);
    
    let timer: NodeJS.Timeout;
    
    if (mapContainerRef.current) {
      timer = setTimeout(() => {
        console.log('Attempting to initialize map for the first time');
        initializeMap();
      }, 500);
    } else {
      console.warn('Map container ref is not available yet');
    }
    
    return () => {
      clearTimeout(timer);
      if (map) {
        console.log('Cleaning up map instance on component unmount');
        map.off();
        map.remove();
      }
    };
  }, [mapReady, initializeMap, map]);

  // Handle coordinate changes
  useEffect(() => {
    if (!mapReady) return;
    
    console.log(`Map coordinates changed: lat=${lat}, lng=${lng}`);
    if (initAttempts > 0 && (lat !== undefined || lng !== undefined)) {
      const timer = setTimeout(() => {
        console.log('Coordinates changed, reinitializing map');
        setMapLoaded(false);
        setMapState(prev => ({ ...prev, isLoading: true, mapError: null }));
        forceReload();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [lat, lng, mapReady, initAttempts, forceReload, setMapState]);

  const handleVehicleMouseDown = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedVehicle(vehicleId);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRetry = () => {
    console.log('Manual retry requested by user');
    setLoadRetries(prev => prev + 1);
    setMapLoaded(false);
    
    // Reset mapReady to true to ensure we have a fresh reference
    setMapReady(true);
    
    // Notify the user that we're trying to reload
    toast('Tentative de rechargement', {
      description: 'Rechargement de la carte en cours...',
    });
    
    // Short delay before forcing reload
    setTimeout(() => {
      if (mapContainerRef.current) {
        console.log('Map container exists on retry, proceeding with reload');
        forceReload();
      } else {
        console.error('Map container still not found on retry');
        setMapState(prev => ({
          ...prev,
          isLoading: false,
          mapError: 'Conteneur de carte introuvable. Veuillez réessayer.'
        }));
      }
    }, 100);
  };

  const openDiagnosticDialog = () => {
    setShowDiagnosticDialog(true);
  };

  // Additional debugging info
  useEffect(() => {
    console.log('Map component state:', {
      mapReady,
      mapLoaded,
      isLoading,
      hasError: !!mapError,
      containerExists: !!mapContainerRef.current,
      mapExists: !!map,
      initAttempts
    });
  }, [mapReady, mapLoaded, isLoading, mapError, map, initAttempts]);

  return (
    <div className="space-y-4">
      <MapControls
        onAddVehicle={addVehicle}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={() => setZoom(prev => Math.min(prev + 0.1, 2))}
        onZoomOut={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
        isUndoDisabled={historyIndex <= 0}
        isRedoDisabled={historyIndex >= history.length - 1}
      />

      <div className="relative w-full h-[500px] border border-constalib-gray rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-gray-500 mb-2">Chargement de la carte...</div>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-constalib-blue"></div>
              
              {/* Add reload button if loading takes too long */}
              {initAttempts > 1 && (
                <div className="mt-4">
                  <p className="text-sm text-amber-600 mb-2">Le chargement semble prendre du temps...</p>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleRetry} 
                      variant="outline" 
                      size="sm"
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Forcer le rechargement
                    </Button>
                    
                    <Button
                      onClick={openDiagnosticDialog}
                      variant="outline"
                      size="sm"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Diagnostic
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : mapError ? (
          <MapError error={mapError} onRetry={handleRetry} />
        ) : (
          <>
            {/* We always render the map container div, even when not loaded */}
            <div 
              ref={mapContainerRef}
              id="accident-location-map" 
              className="absolute inset-0 z-0"
              style={{ height: '100%', width: '100%' }}
              onMouseUp={handleMouseUp}
            />
            
            {!mapLoaded && !isLoading && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                <div className="animate-pulse rounded-full h-6 w-6 border-b-2 border-constalib-blue"></div>
              </div>
            )}
            
            {vehicles.map(vehicle => (
              <VehicleIcon
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={selectedVehicle === vehicle.id}
                onMouseDown={handleVehicleMouseDown}
                onRotate={rotateVehicle}
                onRemove={removeVehicle}
              />
            ))}
          </>
        )}
        
        {!isLoading && !mapError && !lat && !lng && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
            <div className="text-center p-4">
              <p className="text-constalib-dark-gray mb-2">
                <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                Coordonnées GPS manquantes
              </p>
              <Button onClick={handleRetry} size="sm">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        )}
        
        {/* Add diagnostic button in the corner */}
        <div className="absolute bottom-2 right-2 z-10">
          <Button 
            onClick={openDiagnosticDialog} 
            variant="outline" 
            size="sm"
            className="bg-white/80 hover:bg-white border-gray-200"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-constalib-dark-gray">
        <p>Glissez les véhicules sur la carte pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
        {(!lat || !lng) && (
          <p className="text-amber-600 mt-1">
            Conseil: Retournez à l'étape précédente pour définir la position exacte de l'accident.
          </p>
        )}
      </div>
      
      <Dialog open={showDiagnosticDialog} onOpenChange={setShowDiagnosticDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informations de diagnostic</DialogTitle>
            <DialogDescription>
              Ces informations peuvent aider à résoudre les problèmes de chargement de la carte.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 my-4">
            <div className="text-sm">
              <h4 className="font-medium mb-1">État actuel:</h4>
              <ul className="ml-5 list-disc space-y-1">
                <li>Carte chargée: {mapLoaded ? 'Oui' : 'Non'}</li>
                <li>Composant prêt: {mapReady ? 'Oui' : 'Non'}</li>
                <li>En chargement: {isLoading ? 'Oui' : 'Non'}</li>
                <li>Erreur: {mapError || 'Aucune'}</li>
                <li>Conteneur disponible: {mapContainerRef.current ? 'Oui' : 'Non'}</li>
                <li>Tentatives d'initialisation: {initAttempts}</li>
                <li>Coordonnées: {lat && lng ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : 'Non définies'}</li>
              </ul>
            </div>
            
            <div className="text-sm">
              <h4 className="font-medium mb-1">Informations techniques:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto whitespace-pre-wrap">
                {getDiagnosticInfo()}
              </pre>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleRetry} className="mr-2">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Réinitialiser la carte
            </Button>
            <Button onClick={() => setShowDiagnosticDialog(false)} variant="secondary">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccidentLocationMap;
