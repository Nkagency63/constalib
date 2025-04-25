
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from '../types';
import { toast } from 'sonner';

const VEHICLE_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const addVehicle = (location: L.LatLng) => {
    if (vehicles.length >= VEHICLE_COLORS.length) {
      toast.warning(`Maximum de ${VEHICLE_COLORS.length} véhicules atteint.`);
      return;
    }

    const newVehicle: Vehicle = {
      id: uuidv4(),
      position: [location.lat, location.lng],
      color: VEHICLE_COLORS[vehicles.length % VEHICLE_COLORS.length],
      rotation: 0,
      isSelected: false
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    selectVehicle(newVehicle.id);
    
    return updatedVehicles;
  };

  const removeVehicle = (id: string) => {
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

  return {
    vehicles,
    selectedVehicle,
    addVehicle,
    removeVehicle,
    selectVehicle,
    setVehicles,
    VEHICLE_COLORS
  };
};
