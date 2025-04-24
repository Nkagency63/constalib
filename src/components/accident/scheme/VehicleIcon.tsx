
import React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';
import L from 'leaflet';
import { createCarIcon } from '@/utils/mapIcons';

interface VehicleIconProps {
  position: [number, number];
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const VehicleIcon: React.FC<VehicleIconProps> = ({ position, color, isSelected, onClick }) => {
  const carIcon = createCarIcon(color, isSelected);
  
  return (
    <Marker 
      position={position} 
      icon={carIcon} 
      eventHandlers={{ 
        click: onClick 
      }} 
    />
  );
};

export default VehicleIcon;
