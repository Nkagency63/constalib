
import React from 'react';
import VehicleIcon from '../VehicleIcon';
import { Vehicle } from '../types';

interface MapVehiclesProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  onVehicleMouseDown: (vehicleId: string, e: React.MouseEvent) => void;
  onRotateVehicle: (vehicleId: string, angle: number) => void;
  onRemoveVehicle: (vehicleId: string) => void;
}

const MapVehicles: React.FC<MapVehiclesProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleMouseDown,
  onRotateVehicle,
  onRemoveVehicle,
}) => {
  return (
    <>
      {vehicles.map(vehicle => (
        <VehicleIcon
          key={vehicle.id}
          vehicle={vehicle}
          isSelected={selectedVehicle === vehicle.id}
          onMouseDown={onVehicleMouseDown}
          onRotate={onRotateVehicle}
          onRemove={onRemoveVehicle}
        />
      ))}
    </>
  );
};

export default MapVehicles;
