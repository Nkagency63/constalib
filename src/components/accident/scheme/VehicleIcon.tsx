
import { CarFront } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VehicleIconProps {
  color: string;
  label: string;
  vehicleId?: 'A' | 'B' | 'C' | 'D';
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
  return (
    <div 
      className={cn(
        "absolute cursor-move group transition-transform hover:scale-105", 
        isSelected ? 'ring-2 ring-constalib-blue ring-offset-2' : ''
      )} 
      style={style} 
      onMouseDown={onMouseDown}
    >
      <div 
        className="relative w-16 h-22 flex flex-col items-center justify-center rounded-lg shadow-lg" 
        style={{ backgroundColor: color }}
      >
        <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-lg">
          {vehicleId}
        </div>
        
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-left-4 border-right-4 border-solid border-transparent border-b-white border-b-8" 
          style={{ transform: `rotate(${isSelected ? '45deg' : '0deg'})` }}>
        </div>
        
        <CarFront className="w-9 h-9 text-white stroke-[1.5] transition-transform" strokeWidth={2} />
        
        <div className="text-white text-xs font-medium mt-1 truncate max-w-[90%] text-center py-[2px] mx-0 my-0 px-0 rounded-md">
          {label}
        </div>
        
        {isSelected && (
          <div className="absolute inset-0 border-2 border-constalib-blue opacity-50 animate-pulse my-[15px] mx-[15px] rounded"></div>
        )}
      </div>
      
      {children}
    </div>
  );
};

export default VehicleIcon;
