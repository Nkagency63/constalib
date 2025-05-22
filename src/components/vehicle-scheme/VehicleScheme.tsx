
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

  return (
    <div className="w-full space-y-4">
      <MapView
        geolocation={geolocation}
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={(id) => setSelectedVehicle(id)}
        onVehicleMove={(id, lat, lng) => {
          setVehicles(prevVehicles => 
            prevVehicles.map(v => 
              v.id === id ? { ...v, mapLat: lat, mapLng: lng } : v
            )
          );
        }}
        onVehicleAdd={addVehicle}
        onVehicleRotate={rotateVehicle}
        onVehicleRemove={removeVehicle}
      />
    </div>
  );
};

export default VehicleScheme;
