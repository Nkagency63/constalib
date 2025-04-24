
import { useRef } from 'react';
import { useVehicleScheme } from './accident/scheme/useVehicleScheme';
import CanvasToolbar from './accident/scheme/CanvasToolbar';
import VehicleIcon from './accident/scheme/VehicleIcon';
import VehicleControls from './accident/scheme/VehicleControls';

const VehicleScheme = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    vehicles,
    selectedVehicle,
    zoom,
    isDragging,
    historyIndex,
    history,
    addVehicle,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    rotateVehicle,
    removeVehicle,
    undo,
    redo,
    zoomIn,
    zoomOut,
  } = useVehicleScheme();

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    handleMouseMove(e, canvasRef.current.getBoundingClientRect());
  };

  return (
    <div className="w-full">
      <CanvasToolbar
        onAddVehicle={addVehicle}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      
      <div className="relative w-full h-[400px] border border-constalib-gray rounded-lg overflow-hidden bg-white mb-4">
        <div 
          ref={canvasRef}
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U2ZTZlNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {vehicles.map(vehicle => (
            <VehicleIcon
              key={vehicle.id}
              color={vehicle.color}
              label={vehicle.label}
              isSelected={selectedVehicle === vehicle.id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleMouseDown(vehicle.id);
              }}
              style={{
                left: `${vehicle.x}px`,
                top: `${vehicle.y}px`,
                transform: `translate(-50%, -50%) rotate(${vehicle.rotation}deg)`,
                zIndex: selectedVehicle === vehicle.id ? 10 : 1
              }}
            >
              {selectedVehicle === vehicle.id && (
                <VehicleControls
                  vehicleId={vehicle.id}
                  onRotate={rotateVehicle}
                  onRemove={removeVehicle}
                />
              )}
            </VehicleIcon>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-constalib-dark-gray">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleScheme;
