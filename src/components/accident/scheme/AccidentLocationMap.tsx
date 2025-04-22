
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useVehicleScheme } from './useVehicleScheme';
import { useMapInitialization } from './hooks/useMapInitialization';
import VehicleIcon from './VehicleIcon';
import MapControls from './components/MapControls';
import MapError from './components/MapError';
import MapDiagnosticDialog from './components/MapDiagnosticDialog';
import MapLoadingFallback from './components/MapLoadingFallback';
import MapMissingCoordinates from './components/MapMissingCoordinates';
import { Button } from '@/components/ui/button';
import { RefreshCcw, CheckCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

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
    setMapLoaded(true);
    toast('Carte chargée', {
      description: 'La carte a été chargée avec succès',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    });
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (!mapReady) return;
    let timer: NodeJS.Timeout;
    if (mapContainerRef.current) {
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
  }, [mapReady, initializeMap, map]);

  useEffect(() => {
    if (!mapReady) return;
    if (initAttempts > 0 && (lat !== undefined || lng !== undefined)) {
      const timer = setTimeout(() => {
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
    setLoadRetries(prev => prev + 1);
    setMapLoaded(false);
    setMapReady(true);
    toast('Tentative de rechargement', {
      description: 'Rechargement de la carte en cours...',
    });
    setTimeout(() => {
      if (mapContainerRef.current) {
        forceReload();
      } else {
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

  // Pour affichage dans le Dialog
  const diagnosticState = {
    mapLoaded,
    mapReady,
    isLoading,
    mapError,
    containerExists: !!mapContainerRef.current,
    initAttempts,
    lat,
    lng,
    getDiagnosticInfo,
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
          <MapLoadingFallback
            initAttempts={initAttempts}
            onRetry={handleRetry}
            onOpenDiagnostics={openDiagnosticDialog}
          />
        ) : mapError ? (
          <MapError error={mapError} onRetry={handleRetry} />
        ) : (
          <>
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
          <MapMissingCoordinates onRetry={handleRetry} />
        )}

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

      <MapDiagnosticDialog
        open={showDiagnosticDialog}
        onOpenChange={setShowDiagnosticDialog}
        state={diagnosticState}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default AccidentLocationMap;
