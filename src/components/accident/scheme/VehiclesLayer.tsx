
import React from 'react';
import VehicleIcon from './VehicleIcon';
import VehicleControls from './VehicleControls';
import { Vehicle } from '../types';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  readOnly: boolean;
  onVehicleSelect: (id: string | null) => void;
  onRemoveVehicle: (id: string) => void;
}

const VehiclesLayer = ({
  vehicles,
  selectedVehicle,
  readOnly,
  onVehicleSelect,
  onRemoveVehicle
}: VehiclesLayerProps) => {
  return (
    <>
      {vehicles.map((vehicle) => (
        <VehicleIcon
          key={vehicle.id}
          color={vehicle.color}
          label={vehicle.brand || "Véhicule"}
          vehicleId={vehicle.vehicleId}
          isSelected={selectedVehicle === vehicle.id}
          onMouseDown={() => !readOnly && onVehicleSelect(vehicle.id)}
          style={{
            position: 'absolute',
            zIndex: 1000,
            transform: `translate(-50%, -50%) rotate(${vehicle.rotation}deg)`,
          }}
        />
      ))}
      
      {selectedVehicle && !readOnly && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
          {vehicles.map(vehicle => (
            vehicle.id === selectedVehicle && (
              <VehicleControls
                key={vehicle.id}
                vehicleId={vehicle.id}
                onRemove={onRemoveVehicle}
                onRotate={(id, angle) => {
                  // Cette fonctionnalité sera implémentée plus tard
                }}
              />
            )
          ))}
        </div>
      )}
    </>
  );
};

export default VehiclesLayer;
