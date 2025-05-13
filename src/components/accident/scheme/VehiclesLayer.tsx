import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Vehicle } from '../types';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, Trash2 } from 'lucide-react';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
  onMoveVehicle: (vehicleId: string, position: [number, number]) => void;
  onRotateVehicle: (vehicleId: string, rotation: number) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  readOnly?: boolean;
}

// Helper function to create a vehicle icon
const createVehicleIcon = (color: string, rotation: number, isSelected: boolean, vehicleType: string = 'car') => {
  const svg = `
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style="transform: rotate(${rotation}deg)"
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.3"/>
        </filter>
      </defs>
      ${isSelected ? '<circle cx="16" cy="16" r="15" fill="white" stroke="black" stroke-width="2" filter="url(#shadow)"/>' : ''}
      <g transform="translate(16, 16) rotate(${rotation}) translate(-16, -16)">
        ${vehicleType === 'car' ? `
          <rect x="8" y="12" width="16" height="8" fill="${color}" stroke="black" stroke-width="1" stroke-linejoin="round"/>
          <circle cx="12" cy="22" r="2" fill="black"/>
          <circle cx="20" cy="22" r="2" fill="black"/>
        ` : vehicleType === 'truck' ? `
          <rect x="6" y="10" width="20" height="10" fill="${color}" stroke="black" stroke-width="1" stroke-linejoin="round"/>
          <rect x="6" y="6" width="8" height="4" fill="${color}" stroke="black" stroke-width="1" stroke-linejoin="round"/>
          <circle cx="12" cy="22" r="2" fill="black"/>
          <circle cx="20" cy="22" r="2" fill="black"/>
        ` : `
          <path d="M16 4 L24 12 L8 12 Z" fill="${color}" stroke="black" stroke-width="1" stroke-linejoin="round"/>
          <circle cx="16" cy="22" r="6" fill="${color}" stroke="black" stroke-width="1" stroke-linejoin="round"/>
        `}
      </g>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'vehicle-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Helper function to extract latlng from drag event
const getLatLngFromEvent = (e: L.DragEndEvent): [number, number] => {
  const marker = e.target;
  const position = marker.getLatLng();
  return [position.lat, position.lng];
};

const VehiclesLayer: React.FC<VehiclesLayerProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onMoveVehicle,
  onRotateVehicle,
  onDeleteVehicle,
  readOnly = false,
}) => {
  const map = useMap();

  return (
    <>
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={vehicle.position}
          icon={
            createVehicleIcon(
              vehicle.color,
              vehicle.rotation,
              vehicle.id === selectedVehicleId,
              vehicle.vehicleType || 'car'
            )
          }
          draggable={!readOnly}
          eventHandlers={{
            click: () => !readOnly && onSelectVehicle(vehicle.id),
            dragend: (e) => !readOnly && onMoveVehicle(vehicle.id, getLatLngFromEvent(e)),
          }}
        >
          {vehicle.id === selectedVehicleId && !readOnly && (
            <Popup closeButton={false} className="vehicle-popup">
              <div className="flex flex-col space-y-2 p-1">
                <div className="text-sm font-medium">
                  {vehicle.vehicleId === 'A' ? 'Véhicule A' : vehicle.vehicleId === 'B' ? 'Véhicule B' : 'Véhicule'}
                  {vehicle.brand && vehicle.model ? ` - ${vehicle.brand} ${vehicle.model}` : vehicle.brand || vehicle.model ? ` - ${vehicle.brand || vehicle.model}` : ''}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 p-1"
                    onClick={() => onRotateVehicle(vehicle.id, -15)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 p-1"
                    onClick={() => onDeleteVehicle(vehicle.id)}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 p-1"
                    onClick={() => onRotateVehicle(vehicle.id, 15)}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
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
