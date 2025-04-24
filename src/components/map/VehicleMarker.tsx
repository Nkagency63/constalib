
import { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { Vehicle } from './types';
import { createVehicleIcon } from './utils';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRotate: (id: string, angle: number) => void;
  onRemove: (id: string) => void;
}

const VehicleMarker = ({ 
  vehicle, 
  isSelected, 
  onSelect, 
  onRotate, 
  onRemove 
}: VehicleMarkerProps) => {
  const map = useMap();
  const vehicleIcon = createVehicleIcon(vehicle, isSelected);
  
  const eventHandlers = {
    click: () => {
      onSelect(vehicle.id);
    }
  };
  
  useEffect(() => {
    if (!isSelected) return;
    
    // Find and attach event handlers to control buttons
    setTimeout(() => {
      const rotateLeftBtn = document.querySelector('.vehicle-rotate-left');
      const rotateRightBtn = document.querySelector('.vehicle-rotate-right');
      const removeBtn = document.querySelector('.vehicle-remove');
      
      if (rotateLeftBtn) {
        rotateLeftBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onRotate(vehicle.id, -45);
        });
      }
      
      if (rotateRightBtn) {
        rotateRightBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onRotate(vehicle.id, 45);
        });
      }
      
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onRemove(vehicle.id);
        });
      }
    }, 0);
    
    return () => {
      const rotateLeftBtn = document.querySelector('.vehicle-rotate-left');
      const rotateRightBtn = document.querySelector('.vehicle-rotate-right');
      const removeBtn = document.querySelector('.vehicle-remove');
      
      if (rotateLeftBtn) rotateLeftBtn.remove();
      if (rotateRightBtn) rotateRightBtn.remove();
      if (removeBtn) removeBtn.remove();
    };
  }, [isSelected, onRotate, onRemove, vehicle.id]);
  
  return (
    <Marker
      position={vehicle.position}
      icon={vehicleIcon}
      eventHandlers={eventHandlers}
    />
  );
};

export default VehicleMarker;
