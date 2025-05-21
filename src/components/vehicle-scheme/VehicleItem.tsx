
import React from 'react';
import { RotateCw, RotateCcw, X } from 'lucide-react';
import { Vehicle } from './types';
import { Button } from '@/components/ui/button';

interface VehicleItemProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onMouseDown: (vehicleId: string, e: React.MouseEvent) => void;
  onRotate: (vehicleId: string, angle: number) => void;
  onRemove: (vehicleId: string) => void;
}

const VehicleItem = ({ 
  vehicle, 
  isSelected, 
  onMouseDown, 
  onRotate, 
  onRemove 
}: VehicleItemProps) => {
  const vehicleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${vehicle.x}px`,
    top: `${vehicle.y}px`,
    transform: `rotate(${vehicle.rotation}deg)`,
    backgroundColor: vehicle.color,
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'move',
    userSelect: 'none',
    boxShadow: isSelected ? '0 0 0 2px #000, 0 0 0 4px #fff' : 'none',
    zIndex: isSelected ? 10 : 1
  };

  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '5px',
    backgroundColor: 'white',
    padding: '2px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div 
      style={vehicleStyle}
      onMouseDown={(e) => onMouseDown(vehicle.id, e)}
    >
      {vehicle.label}
      
      {isSelected && (
        <div style={controlsStyle}>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onRotate(vehicle.id, -45);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(vehicle.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onRotate(vehicle.id, 45);
            }}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehicleItem;
