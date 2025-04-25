
import { CarFront } from 'lucide-react';
import { ReactNode } from 'react';

interface VehicleIconProps {
  color: string;
  label: string;
  vehicleId?: 'A' | 'B';
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  style: React.CSSProperties;
  children?: ReactNode;
}

const VehicleIcon = ({ 
  color, 
  label, 
  vehicleId,
  isSelected, 
  onMouseDown, 
  style, 
  children 
}: VehicleIconProps) => {
  const vehicleLabel = vehicleId ? `Véhicule ${vehicleId}` : label;
  
  return (
    <div
      className={`absolute cursor-move group ${isSelected ? 'ring-2 ring-constalib-blue' : ''}`}
      style={style}
      onMouseDown={onMouseDown}
    >
      <div
        className="w-14 h-20 flex flex-col items-center justify-center rounded-lg relative"
        style={{ backgroundColor: color }}
      >
        <CarFront 
          className="w-8 h-8 text-white stroke-[1.5] group-hover:scale-105 transition-transform" 
          strokeWidth={2} 
        />
        <div className="text-white text-xs font-medium mt-1">
          {vehicleLabel}
        </div>
        {isSelected && (
          <div className="absolute inset-0 border-2 border-constalib-blue rounded-lg opacity-50 animate-pulse"></div>
        )}
      </div>
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-constalib-dark-gray bg-white px-1 rounded shadow-sm">
        {vehicleId || label}
      </div>
      
      {children}
    </div>
  );
};

export default VehicleIcon;
