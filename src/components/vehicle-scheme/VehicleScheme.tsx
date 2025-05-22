
import React from 'react';
import { useVehicleScheme } from './useVehicleScheme';
import MapView from './MapView';

interface VehicleSchemeProps {
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
}

const VehicleScheme = ({ geolocation }: VehicleSchemeProps) => {
  const {
    vehicles,
    selectedVehicle,
    addVehicle,
    rotateVehicle,
    removeVehicle,
    setVehicles,
    setSelectedVehicle
  } = useVehicleScheme();

  // Simple wrapper that doesn't actually render the problematic MapView component
  return (
    <div className="w-full space-y-4">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800 text-sm">
          Le schéma interactif des véhicules est temporairement indisponible. Veuillez utiliser la carte standard pour visualiser l'emplacement de l'accident.
        </p>
      </div>
    </div>
  );
};

export default VehicleScheme;
