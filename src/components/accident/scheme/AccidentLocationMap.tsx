
import React, { useEffect, useRef, useCallback } from 'react';
import { useVehicleScheme } from './useVehicleScheme';
import { useMapInitialization } from './hooks/useMapInitialization';
import VehicleIcon from './VehicleIcon';
import MapControls from './components/MapControls';
import MapError from './components/MapError';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface AccidentLocationMapProps {
  lat: number | null;
  lng: number | null;
  address: string;
}

const AccidentLocationMap = ({ lat, lng, address }: AccidentLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [initAttempts, setInitAttempts] = React.useState(0);
  
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

  const { map, isLoading, mapError, initializeMap, setMapState } = useMapInitialization({
    mapRef,
    lat,
    lng,
    handleMapClick,
    onLoadComplete: () => setMapLoaded(true)
  });

  // Initial map loading
  useEffect(() => {
    console.log('Initial map loading effect triggered');
    let timer: NodeJS.Timeout;
    
    if (mapRef.current) {
      timer = setTimeout(() => {
        console.log('Attempting to initialize map for the first time');
        initializeMap();
        setInitAttempts(prev => prev + 1);
      }, 500);
    }
    
    return () => {
      clearTimeout(timer);
      if (map) {
        console.log('Cleaning up map instance');
        map.off();
        map.remove();
      }
    };
  }, []);

  // Handle coordinate changes or retry attempts
  useEffect(() => {
    console.log(`Map coordinates changed or retry attempted: lat=${lat}, lng=${lng}, attempts=${initAttempts}`);
    if (initAttempts > 0) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          console.log('Reinitializing map due to coordinate changes or retry');
          setMapLoaded(false);
          setMapState(prev => ({ ...prev, isLoading: true, mapError: null }));
          initializeMap();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [lat, lng, initAttempts]);

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
    setMapState(prev => ({ ...prev, isLoading: true, mapError: null }));
    setMapLoaded(false);
    
    setTimeout(() => {
      if (mapRef.current) {
        setInitAttempts(prev => prev + 1);
        initializeMap();
      }
    }, 300);
  };

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
              {initAttempts > 2 && (
                <Button 
                  onClick={handleRetry} 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Forcer le rechargement
                </Button>
              )}
            </div>
          </div>
        ) : mapError ? (
          <MapError error={mapError} onRetry={handleRetry} />
        ) : (
          <>
            <div 
              ref={mapRef}
              id="accident-location-map" 
              className="absolute inset-0 z-0"
              style={{ height: '100%' }}
              onMouseUp={handleMouseUp}
            />
            
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
              <p className="text-constalib-dark-gray mb-2">Coordonnées GPS manquantes</p>
              <Button onClick={handleRetry}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-constalib-dark-gray">
        <p>Glissez les véhicules sur la carte pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default AccidentLocationMap;
