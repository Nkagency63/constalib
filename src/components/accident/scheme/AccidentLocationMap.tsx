
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useVehicleScheme } from './useVehicleScheme';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapVehicles } from './hooks/useMapVehicles';
import MapContainer from './components/MapContainer';
import MapControls from './components/MapControls';
import MapError from './components/MapError';
import MapDiagnosticDialog from './components/MapDiagnosticDialog';
import MapLoadingFallback from './components/MapLoadingFallback';
import MapMissingCoordinates from './components/MapMissingCoordinates';
import MapVehicles from './components/MapVehicles';
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

  // Initialisez la carte
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (!isDragging || !selectedVehicle) return;
    const point = e.target.mouseEventToContainerPoint(e.originalEvent);
    updateVehiclePosition(selectedVehicle, point.x, point.y);
  }, [isDragging, selectedVehicle, updateVehiclePosition]);

  const handleMapLoaded = useCallback(() => {
    setMapLoaded(true);
    toast('Carte chargée', {
      description: 'La carte a été chargée avec succès',
    });
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

  const { handleVehicleMouseDown, handleVehicleInteraction } = useMapVehicles(
    vehicles,
    selectedVehicle,
    updateVehiclePosition,
    rotateVehicle,
    removeVehicle
  );

  useEffect(() => {
    if (!mapReady) {
      const timer = setTimeout(() => setMapReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

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

  const handleRetry = () => {
    setMapLoaded(false);
    setMapReady(true);
    forceReload();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
            onOpenDiagnostics={() => setShowDiagnosticDialog(true)}
          />
        ) : mapError ? (
          <MapError error={mapError} onRetry={handleRetry} />
        ) : (
          <>
            <MapContainer
              mapRef={mapContainerRef}
              isLoading={isLoading}
              mapError={mapError}
            />
            
            <MapVehicles
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onVehicleMouseDown={handleVehicleMouseDown}
              onRotateVehicle={rotateVehicle}
              onRemoveVehicle={removeVehicle}
            />

            {!mapLoaded && !isLoading && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                <div className="animate-pulse rounded-full h-6 w-6 border-b-2 border-constalib-blue"></div>
              </div>
            )}
          </>
        )}

        {!isLoading && !mapError && !lat && !lng && (
          <MapMissingCoordinates onRetry={handleRetry} />
        )}
      </div>

      <MapDiagnosticDialog
        open={showDiagnosticDialog}
        onOpenChange={setShowDiagnosticDialog}
        state={{
          mapLoaded,
          mapReady,
          isLoading,
          mapError,
          containerExists: !!mapContainerRef.current,
          initAttempts,
          lat,
          lng,
          getDiagnosticInfo
        }}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default AccidentLocationMap;
