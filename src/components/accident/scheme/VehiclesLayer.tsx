
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Vehicle } from '../types/scheme';
import VehicleIcon from './VehicleIcon';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  readOnly?: boolean;
  onVehicleSelect?: (id: string) => void;
  onRemoveVehicle?: (id: string) => void;
  onRotateVehicle?: (id: string, degrees: number) => void;
  onChangeVehicleType?: (type: 'car' | 'truck' | 'bike') => void;
}

const VehiclesLayer: React.FC<VehiclesLayerProps> = ({
  vehicles,
  selectedVehicleId,
  readOnly = false,
  onVehicleSelect = () => {},
  onRemoveVehicle = () => {},
  onRotateVehicle = () => {},
  onChangeVehicleType = () => {},
}) => {
  return (
    <>
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={vehicle.position}
          draggable={!readOnly}
          icon={VehicleIcon({
            type: vehicle.type,
            color: vehicle.color,
            rotation: vehicle.rotation,
            selected: vehicle.id === selectedVehicleId,
            label: vehicle.label || ''
          })}
          eventHandlers={{
            click: () => onVehicleSelect(vehicle.id),
          }}
        >
          {!readOnly && (
            <Popup>
              <div className="p-1 text-sm">
                <strong>Véhicule {vehicle.label}</strong>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => onRotateVehicle(vehicle.id, 15)}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs block w-full"
                  >
                    Tourner
                  </button>
                  <button
                    onClick={() => onRemoveVehicle(vehicle.id)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs block w-full"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </>
  );
};

export default VehiclesLayer;
