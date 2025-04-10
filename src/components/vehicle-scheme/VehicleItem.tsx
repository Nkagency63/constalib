
import React from 'react';
import { Car, X } from 'lucide-react';
import { Vehicle } from './types';

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
  return (
    <div
      key={vehicle.id}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-constalib-blue' : ''}`}
      style={{
        left: `${vehicle.x}px`,
        top: `${vehicle.y}px`,
        transform: `translate(-50%, -50%) rotate(${vehicle.rotation}deg)`,
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={(e) => onMouseDown(vehicle.id, e)}
    >
      {/* Car icon */}
      <div
        className="w-16 h-32 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: vehicle.color }}
      >
        <Car className="w-8 h-8 text-white" />
      </div>
      
      {/* Label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-constalib-dark-gray bg-white px-1 rounded">
        {vehicle.label}
      </div>
      
      {/* Controls (visible when selected) */}
      {isSelected && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1">
          <button
            className="bg-white p-1 rounded-full shadow-sm text-constalib-dark-gray hover:bg-constalib-light-blue"
            onClick={() => onRotate(vehicle.id, -45)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 15L8 11L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            className="bg-white p-1 rounded-full shadow-sm text-constalib-dark-gray hover:bg-constalib-light-blue"
            onClick={() => onRotate(vehicle.id, 45)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 15L16 11L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            className="bg-white p-1 rounded-full shadow-sm text-red-500 hover:bg-red-50"
            onClick={() => onRemove(vehicle.id)}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VehicleItem;
