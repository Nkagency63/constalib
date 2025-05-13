
import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { Vehicle } from '../types/scheme';
import VehicleIcon from './VehicleIcon';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
  readOnly?: boolean;
  onVehicleSelect: (id: string) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle: (id: string, degrees: number) => void;
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
}

const VehiclesLayer: React.FC<VehiclesLayerProps> = ({
  vehicles,
  selectedVehicleId,
  readOnly = false,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onChangeVehicleType,
}) => {
  const getVehicleIcon = (vehicle: Vehicle) => {
    return L.divIcon({
      className: 'custom-vehicle-icon',
      html: VehicleIcon({
        type: vehicle.type,
        color: vehicle.color,
        rotation: vehicle.rotation,
        selected: vehicle.isSelected
      }),
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  return (
    <>
      {vehicles.map((vehicle) => {
        const vehicleIcon = getVehicleIcon(vehicle);
        
        return (
          <Marker
            key={vehicle.id}
            position={vehicle.position}
            icon={vehicleIcon}
            draggable={!readOnly}
            eventHandlers={{
              click: () => {
                if (!readOnly) {
                  onVehicleSelect(vehicle.id);
                }
              },
              dragend: (e) => {
                if (!readOnly) {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  // We'd update the vehicle position here
                  console.log("Dragged to:", position);
                }
              },
            }}
          >
            {vehicle.type === 'car' && (
              <div className="vehicle-tooltip">Voiture</div>
            )}
            {vehicle.type === 'truck' && (
              <div className="vehicle-tooltip">Camion</div>
            )}
            {vehicle.type === 'bike' && (
              <div className="vehicle-tooltip">Deux-roues</div>
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default VehiclesLayer;
