
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from '../types';
import { toast } from 'sonner';

// Palettes de couleurs pour les véhicules
const VEHICLE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'];

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [currentVehicleType, setCurrentVehicleType] = useState<'car' | 'truck' | 'bike'>('car');

  const addVehicle = useCallback((position: [number, number]) => {
    if (vehicles.length >= 4) {
      toast("Maximum de 4 véhicules atteint");
      return null;
    }

    const newVehicle: Vehicle = {
      id: uuidv4(),
      position,
      rotation: 0,
      color: VEHICLE_COLORS[vehicles.length % VEHICLE_COLORS.length],
      type: currentVehicleType,
      label: `Véhicule ${vehicles.length + 1}`
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    setSelectedVehicle(newVehicle.id);
    
    return updatedVehicles;
  }, [vehicles, currentVehicleType]);

  const removeVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    
    if (selectedVehicle === id) {
      setSelectedVehicle(null);
    }
  }, [selectedVehicle]);

  const updateVehiclePosition = useCallback((id: string, position: [number, number]) => {
    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === id ? { ...vehicle, position } : vehicle
      )
    );
  }, []);

  const rotateVehicle = useCallback((id: string, degrees: number = 15) => {
    setVehicles(prev => 
      prev.map(vehicle => {
        if (vehicle.id === id) {
          // Modifier la rotation en utilisant modulo 360 pour rester dans l'intervalle [0, 360)
          const newRotation = (vehicle.rotation + degrees) % 360;
          return { ...vehicle, rotation: newRotation };
        }
        return vehicle;
      })
    );
  }, []);

  const changeVehicleType = useCallback((type: 'car' | 'truck' | 'bike') => {
    setCurrentVehicleType(type);
    
    // Si un véhicule est sélectionné, changer son type
    if (selectedVehicle) {
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === selectedVehicle ? { ...vehicle, type } : vehicle
        )
      );
    }
  }, [selectedVehicle]);

  const selectVehicle = useCallback((id: string | null) => {
    setSelectedVehicle(id);
    
    // Si un véhicule est sélectionné, mettre à jour le type courant
    if (id) {
      const vehicle = vehicles.find(v => v.id === id);
      if (vehicle) {
        setCurrentVehicleType(vehicle.type);
      }
    }
  }, [vehicles]);

  return {
    vehicles,
    setVehicles,
    selectedVehicle,
    currentVehicleType,
    addVehicle,
    removeVehicle,
    updateVehiclePosition,
    rotateVehicle,
    changeVehicleType,
    selectVehicle
  };
};
