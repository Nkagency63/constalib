
import { useState, useEffect } from 'react';

interface Vehicle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  label: string;
}

export const useVehicleScheme = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<Vehicle[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (vehicles.length === 0 && history[0].length === 0) return;
    
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
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

  const handleMouseDown = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent, canvasRect: DOMRect) => {
    if (!isDragging || !selectedVehicle) return;
    
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

  return {
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
  };
};
