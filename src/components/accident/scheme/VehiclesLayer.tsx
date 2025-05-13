
import React from 'react';
import { Marker, LayerGroup } from 'react-leaflet';
import L, { Icon, DivIcon } from 'leaflet';
import { Vehicle } from '../types';
import VehicleIcon from './VehicleIcon';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleSelect: (id: string) => void;
  onVehicleMove?: (id: string, position: [number, number]) => void;
  readOnly?: boolean;
}

const VehiclesLayer: React.FC<VehiclesLayerProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  onVehicleMove,
  readOnly = false
}) => {
  const createVehicleIcon = (vehicle: Vehicle) => {
    // Create a custom icon for the vehicle
    const iconHtml = document.createElement('div');
    iconHtml.innerHTML = `
      <div class="vehicle-icon" style="transform: rotate(${vehicle.rotation}deg)">
        ${VehicleIcon({ 
          type: vehicle.type, 
          rotation: vehicle.rotation, 
          color: vehicle.color,
          selected: vehicle.id === selectedVehicleId
        })}
      </div>
    `;
    
    return new DivIcon({
      html: iconHtml.innerHTML,
      className: `vehicle-marker ${vehicle.id === selectedVehicleId ? 'selected' : ''}`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  return (
    <LayerGroup>
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={vehicle.position}
          icon={createVehicleIcon(vehicle)}
          eventHandlers={{
            click: () => onVehicleSelect(vehicle.id),
            // Handle dragging for editable vehicles
            drag: (e) => {
              if (onVehicleMove && !readOnly) {
                const marker = e.target;
                const position = marker.getLatLng();
                onVehicleMove(vehicle.id, [position.lat, position.lng]);
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
