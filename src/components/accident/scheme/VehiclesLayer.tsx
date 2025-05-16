
import React from 'react';
import { Marker, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { Vehicle } from '../types';
import { createCarIcon } from '@/utils/mapIcons';
import { toast } from 'sonner';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
  onVehicleSelect: (id: string) => void;
  onRemoveVehicle?: (id: string) => void;
  onRotateVehicle?: (id: string, degrees: number) => void;
  onChangeVehicleType?: (id: string, type: 'car' | 'truck' | 'bike') => void;
  readOnly?: boolean;
  onVehicleMove?: (id: string, position: [number, number]) => void;
}

const VehiclesLayer: React.FC<VehiclesLayerProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onChangeVehicleType,
  readOnly = false,
  onVehicleMove
}) => {
  // Safety check for vehicles
  if (!vehicles || !Array.isArray(vehicles)) {
    console.warn("VehiclesLayer: vehicles prop is not an array or is undefined");
    return <LayerGroup />;
  }

  return (
    <LayerGroup>
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={vehicle.position}
          icon={createCarIcon(
            vehicle.color, 
            vehicle.rotation, 
            vehicle.id === selectedVehicleId,
            vehicle.type
          )}
          eventHandlers={{
            click: () => {
              onVehicleSelect(vehicle.id);
              console.log("Vehicle selected:", vehicle.id);
            },
            dragend: (e) => {
              if (!readOnly && e.target && onVehicleMove) {
                try {
                  const marker = e.target;
                  const latLng = marker.getLatLng();
                  const newPosition: [number, number] = [latLng.lat, latLng.lng];
                  onVehicleMove(vehicle.id, newPosition);
                  console.log("Vehicle moved to:", newPosition);
                  toast("Position du véhicule mise à jour");
                } catch (err) {
                  console.error("Error handling vehicle move:", err);
                }
              }
            },
            dragstart: () => {
              if (!readOnly) {
                onVehicleSelect(vehicle.id);
              }
            }
          }}
          draggable={!readOnly}
        />
      ))}
    </LayerGroup>
  );
};

export default VehiclesLayer;
