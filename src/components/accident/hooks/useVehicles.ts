import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from '../types';
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

  const addVehicle = (location: L.LatLng) => {
    if (vehicles.length >= Object.keys(VEHICLE_COLORS).length) {
      toast.warning(`Maximum de ${Object.keys(VEHICLE_COLORS).length} véhicules atteint`);
      return null;
    }

    // Determine vehicle ID based on existing vehicles
    const usedIds = vehicles.map(v => v.vehicleId);
    const availableIds = (Object.keys(VEHICLE_COLORS) as Array<'A' | 'B' | 'C' | 'D'>).filter(
      id => !usedIds.includes(id)
    );
    const vehicleId = availableIds[0];
    const color = VEHICLE_COLORS[vehicleId];

    // Générer un ID unique pour le véhicule
    const uniqueId = uuidv4();

    // Créer le nouveau véhicule avec une position précise
    const newVehicle: Vehicle = {
      id: uniqueId,
      position: [location.lat, location.lng],
      color,
      vehicleId,
      rotation: 0,
      isSelected: true,
      vehicleType: currentVehicleType
    };

    console.log("Creating new vehicle:", newVehicle);

    // Mettre à jour la liste des véhicules et sélectionner le nouveau véhicule
    const updatedVehicles = [...vehicles, newVehicle];
    
    // Nous devons d'abord mettre à jour les véhicules existants pour désélectionner les autres
    const deselectedVehicles = vehicles.map(v => ({...v, isSelected: false}));
    
    // Puis ajouter le nouveau véhicule sélectionné
    const finalUpdatedVehicles = [...deselectedVehicles, newVehicle];
    
    setVehicles(finalUpdatedVehicles);
    setSelectedVehicle(uniqueId);
    
    console.log("Updated vehicles list:", finalUpdatedVehicles);
    
    return finalUpdatedVehicles;
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

  const changeVehicleType = (type: 'car' | 'truck' | 'bike') => {
    setCurrentVehicleType(type);

    if (selectedVehicle) {
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === selectedVehicle 
          ? { ...vehicle, vehicleType: type }
          : vehicle
      );
      setVehicles(updatedVehicles);
      return updatedVehicles;
    }
    
    return vehicles;
  };

  // Afficher dans la console les véhicules actuels pour déboguer
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
