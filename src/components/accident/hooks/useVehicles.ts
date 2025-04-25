import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from '../types';
import { toast } from 'sonner';

const VEHICLE_COLORS = {
  A: '#3b82f6', // Bleu pour véhicule A
  B: '#ef4444', // Rouge pour véhicule B
};

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const addVehicle = (location: L.LatLng) => {
    if (vehicles.length >= 2) {
      toast.warning('Maximum de 2 véhicules atteint');
      return;
    }

    // Determine if this is vehicle A or B
    const vehicleId = vehicles.length === 0 ? 'A' : 'B';
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
    const updatedVehicles = vehicles.filter(v => v.id !== id)
      .map((v, index) => ({
        ...v,
        vehicleId: index === 0 ? 'A' : 'B' as 'A' | 'B'
      }));
    
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
