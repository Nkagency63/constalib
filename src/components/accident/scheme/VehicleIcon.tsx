
import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

interface VehicleIconProps {
  position: [number, number];
  color: string;
  isSelected: boolean;
  onClick?: () => void;
  label: 'A' | 'B';
}

const VehicleIcon: React.FC<VehicleIconProps> = ({ 
  position, 
  color, 
  isSelected, 
  onClick,
  label 
}) => {
  // Créer une icône personnalisée avec le label A ou B
  const icon = L.divIcon({
    className: 'custom-vehicle-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        border: ${isSelected ? '3px solid #000' : '2px solid #fff'};
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        ${label}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <Marker 
      position={position} 
      icon={icon}
      eventHandlers={{ click: onClick }}
    />
  );
};

export default VehicleIcon;
