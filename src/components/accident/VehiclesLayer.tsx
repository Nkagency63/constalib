
import React from 'react';
import { Marker, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { Vehicle } from './types';
import { createCarIcon } from '@/utils/mapIcons';
import { toast } from 'sonner';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
  onVehicleSelect: (id: string) => void;
  onRemoveVehicle?: (id: string) => void;
  onRotateVehicle?: (id: string, degrees: number) => void;
  onChangeVehicleType?: (type: 'car' | 'truck' | 'bike') => void;
  readOnly?: boolean;
  onVehicleMove?: (id: string, position: [number, number]) => void;
}

const VehiclesLayer: React.FC<VehiclesLayerProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  readOnly = false
}) => {
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
              if (!readOnly && e.target) {
                const marker = e.target;
                const latLng = marker.getLatLng();
                // Update vehicle position in parent component if needed
                console.log("Vehicle moved to:", [latLng.lat, latLng.lng]);
                toast("Position du véhicule mise à jour");
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
