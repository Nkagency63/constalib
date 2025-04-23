
import { useCallback } from 'react';
import { Vehicle } from '../types';

export const useMapVehicles = (
  vehicles: Vehicle[],
  selectedVehicle: string | null,
  updateVehiclePosition: (id: string, x: number, y: number) => void,
  rotateVehicle: (id: string, angle: number) => void,
  removeVehicle: (id: string) => void
) => {
  const handleVehicleMouseDown = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    return { vehicleId, event: e };
  };

  const handleVehicleInteraction = useCallback((
    vehicle: Vehicle,
    isSelected: boolean,
    onMouseDown: (vehicleId: string, e: React.MouseEvent) => void,
  ) => ({
    vehicle,
    isSelected,
    onMouseDown,
    onRotate: rotateVehicle,
    onRemove: removeVehicle,
  }), [rotateVehicle, removeVehicle]);

  return {
    handleVehicleMouseDown,
    handleVehicleInteraction,
  };
};
