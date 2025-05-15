
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from '../types/scheme';
import { toast } from 'sonner';

export const VEHICLE_COLORS: Record<'A' | 'B' | 'C' | 'D', string> = {
  'A': '#1e40af', // Bleu plus vif
  'B': '#dc2626', // Rouge éclatant
  'C': '#059669', // Vert visible
  'D': '#d97706', // Orange distinct
};

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [currentVehicleType, setCurrentVehicleType] = useState<'car' | 'truck' | 'bike'>('car');

  const addVehicle = useCallback((position: [number, number], type: 'car' | 'truck' | 'bike' = 'car') => {
    if (vehicles.length >= Object.keys(VEHICLE_COLORS).length) {
      toast.error("Limite atteinte", {
        description: "Maximum de 4 véhicules atteint"
      });
      return null;
    }

    // Determine vehicle ID based on existing vehicles
    const usedIds = vehicles.map(v => v.id);
    const availableIds = (Object.keys(VEHICLE_COLORS) as Array<'A' | 'B' | 'C' | 'D'>).filter(
      id => !usedIds.includes(id)
    );
    
    // Generate a unique ID for the vehicle
    const uniqueId = uuidv4();

    // Create the new vehicle with a precise position
    const newVehicle: Vehicle = {
      id: uniqueId,
      position: position,
      color: getRandomColor(),
      rotation: 0, // north is 0 degrees
      isSelected: true,
      type: type
    };

    console.log("Creating new vehicle:", newVehicle);

    // Update the vehicle list and select the new vehicle
    const updatedVehicles = [...vehicles, newVehicle];
    
    // We must first update existing vehicles to deselect the others
    const deselectedVehicles = vehicles.map(v => ({...v, isSelected: false}));
    
    // Then add the new selected vehicle
    const finalUpdatedVehicles = [...deselectedVehicles, newVehicle];
    
    setVehicles(finalUpdatedVehicles);
    setSelectedVehicle(uniqueId);
    
    console.log("Updated vehicles list:", finalUpdatedVehicles);
    
    return finalUpdatedVehicles;
  }, [vehicles]);

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

  const changeVehicleType = (type: 'car' | 'truck' | 'bike') => {
    setCurrentVehicleType(type);

    if (selectedVehicle) {
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === selectedVehicle 
          ? { ...vehicle, type: type }
          : vehicle
      );
      setVehicles(updatedVehicles);
      return updatedVehicles;
    }
    
    return vehicles;
  };

  // Log current vehicles for debugging
  useEffect(() => {
    console.log("Current vehicles:", vehicles);
  }, [vehicles]);

  return {
    vehicles,
    selectedVehicle,
    currentVehicleType,
    addVehicle,
    removeVehicle,
    selectVehicle,
    rotateVehicle,
    changeVehicleType,
    setVehicles,
    VEHICLE_COLORS
  };
};

function getRandomColor(): string {
  const colors = Object.values(VEHICLE_COLORS);
  return colors[Math.floor(Math.random() * colors.length)];
}
