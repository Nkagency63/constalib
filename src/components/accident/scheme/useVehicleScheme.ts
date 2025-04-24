
import { useState, useEffect } from 'react';
import { Vehicle } from './types';

export const useVehicleScheme = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<Vehicle[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

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

  const updateVehiclePosition = (vehicleId: string, x: number, y: number) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === vehicleId 
        ? { ...vehicle, x, y } 
        : vehicle
      )
    );
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

  return {
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
  };
};
