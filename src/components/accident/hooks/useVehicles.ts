
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from '../types';
import { toast } from 'sonner';

export const VEHICLE_COLORS = {
  'A': '#3b82f6', // Blue for vehicle A
  'B': '#ef4444', // Red for vehicle B
  'C': '#10b981', // Green for vehicle C
  'D': '#f59e0b', // Amber for vehicle D
};

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const addVehicle = (location: L.LatLng) => {
    if (vehicles.length >= Object.keys(VEHICLE_COLORS).length) {
      toast.warning(`Maximum de ${Object.keys(VEHICLE_COLORS).length} véhicules atteint`);
      return null;
    }

    // Determine vehicle ID based on existing vehicles
    const usedIds = vehicles.map(v => v.vehicleId);
    const availableIds = Object.keys(VEHICLE_COLORS).filter(id => !usedIds.includes(id)) as ('A' | 'B' | 'C' | 'D')[];
    const vehicleId = availableIds[0];
    const color = VEHICLE_COLORS[vehicleId];

    const newVehicle: Vehicle = {
      id: uuidv4(),
      position: [location.lat, location.lng],
      color,
      vehicleId,
      rotation: 0,
      isSelected: false
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    selectVehicle(newVehicle.id);
    
    return updatedVehicles;
  };

  const removeVehicle = (id: string) => {
    const vehicleToRemove = vehicles.find(v => v.id === id);
    if (!vehicleToRemove) return vehicles;
    
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    
    setVehicles(updatedVehicles);
    
    if (selectedVehicle === id) {
      setSelectedVehicle(null);
    }
    
    return updatedVehicles;
  };

  const selectVehicle = (id: string | null) => {
    setSelectedVehicle(id);
    setVehicles(vehicles.map(vehicle => ({
      ...vehicle,
      isSelected: vehicle.id === id
    })));
  };

  const rotateVehicle = (id: string, degrees: number) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === id 
        ? { ...vehicle, rotation: (vehicle.rotation + degrees) % 360 }
        : vehicle
    );
    setVehicles(updatedVehicles);
    return updatedVehicles;
  };

  return {
    vehicles,
    selectedVehicle,
    addVehicle,
    removeVehicle,
    selectVehicle,
    rotateVehicle,
    setVehicles,
    VEHICLE_COLORS
  };
};
