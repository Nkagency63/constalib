
import { useRef } from 'react';
import Button from './Button';
import { Car, Undo, Redo, Plus, Minus } from 'lucide-react';
import { useVehicleScheme } from './accident/scheme/useVehicleScheme';
import VehicleIcon from './accident/scheme/VehicleIcon';

const VehicleScheme = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedVehicle || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left) / zoom;
    const y = (e.clientY - canvasRect.top) / zoom;
    
    updateVehiclePosition(selectedVehicle, x, y);
  };

  const handleMouseDown = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedVehicle(vehicleId);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  const zoomOut = () => setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button variant="outline" onClick={addVehicle}>
          <Car className="w-4 h-4 mr-2" />
          Ajouter un véhicule
        </Button>
        
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={undo} 
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={redo} 
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative w-full h-[400px] border border-constalib-gray rounded-lg overflow-hidden bg-white mb-4">
        <div 
          ref={canvasRef}
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U2ZTZlNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {vehicles.map(vehicle => (
            <VehicleIcon
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicle === vehicle.id}
              onMouseDown={handleMouseDown}
              onRotate={rotateVehicle}
              onRemove={removeVehicle}
            />
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
