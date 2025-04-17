import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { Car, Undo, Redo, Save, Plus, Minus, X } from 'lucide-react';

interface Vehicle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  label: string;
}

const VehicleScheme = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<Vehicle[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add snapshot to history when vehicles change
  useEffect(() => {
    if (vehicles.length === 0 && history[0].length === 0) return;
    
    if (historyIndex < history.length - 1) {
      // If we're in the middle of the history, truncate
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    // Add current state to history
    setHistory(prevHistory => [...prevHistory, [...vehicles]]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [vehicles]);

  const addVehicle = () => {
    const colors = ['#ff9f43', '#0abde3', '#10ac84', '#ee5253'];
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      x: 150,
      y: 150,
      rotation: 0,
      color: colors[vehicles.length % colors.length],
      label: `Véhicule ${vehicles.length + 1}`
    };
    
    setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
  };

  const handleMouseDown = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedVehicle(vehicleId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedVehicle || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left) / zoom;
    const y = (e.clientY - canvasRect.top) / zoom;
    
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === selectedVehicle 
        ? { ...vehicle, x, y } 
        : vehicle
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const rotateVehicle = (vehicleId: string, angle: number) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === vehicleId 
        ? { ...vehicle, rotation: vehicle.rotation + angle } 
        : vehicle
      )
    );
  };

  const removeVehicle = (vehicleId: string) => {
    setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
    if (selectedVehicle === vehicleId) {
      setSelectedVehicle(null);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setVehicles(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setVehicles(history[historyIndex + 1]);
    }
  };

  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
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
      
      {/* Canvas */}
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
            <div
              key={vehicle.id}
              className={`absolute cursor-move ${selectedVehicle === vehicle.id ? 'ring-2 ring-constalib-blue' : ''}`}
              style={{
                left: `${vehicle.x}px`,
                top: `${vehicle.y}px`,
                transform: `translate(-50%, -50%) rotate(${vehicle.rotation}deg)`,
                zIndex: selectedVehicle === vehicle.id ? 10 : 1
              }}
              onMouseDown={(e) => handleMouseDown(vehicle.id, e)}
            >
              {/* Car icon */}
              <div
                className="w-16 h-32 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: vehicle.color }}
              >
                <Car className="w-8 h-8 text-white" />
              </div>
              
              {/* Label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-constalib-dark-gray bg-white px-1 rounded">
                {vehicle.label}
              </div>
              
              {/* Controls (visible when selected) */}
              {selectedVehicle === vehicle.id && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1">
                  <button
                    className="bg-white p-1 rounded-full shadow-sm text-constalib-dark-gray hover:bg-constalib-light-blue"
                    onClick={() => rotateVehicle(vehicle.id, -45)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 15L8 11L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button
                    className="bg-white p-1 rounded-full shadow-sm text-constalib-dark-gray hover:bg-constalib-light-blue"
                    onClick={() => rotateVehicle(vehicle.id, 45)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 15L16 11L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button
                    className="bg-white p-1 rounded-full shadow-sm text-red-500 hover:bg-red-50"
                    onClick={() => removeVehicle(vehicle.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="text-sm text-constalib-dark-gray">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleScheme;
