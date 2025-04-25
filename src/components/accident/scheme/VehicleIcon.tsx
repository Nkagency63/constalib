
import { CarFront } from 'lucide-react';
import { ReactNode } from 'react';

interface VehicleIconProps {
  color: string;
  label: string;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  style: React.CSSProperties;
  children?: ReactNode;
}

const VehicleIcon = ({ color, label, isSelected, onMouseDown, style, children }: VehicleIconProps) => {
  return (
    <div
      className={`absolute cursor-move group ${isSelected ? 'ring-2 ring-constalib-blue' : ''}`}
      style={style}
      onMouseDown={onMouseDown}
    >
      <div
        className="w-14 h-20 flex items-center justify-center rounded-lg relative"
        style={{ backgroundColor: color }}
      >
        <CarFront 
          className="w-8 h-8 text-white stroke-[1.5] group-hover:scale-105 transition-transform" 
          strokeWidth={2} 
        />
        {isSelected && (
          <div className="absolute inset-0 border-2 border-constalib-blue rounded-lg opacity-50 animate-pulse"></div>
        )}
      </div>
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-constalib-dark-gray bg-white px-1 rounded shadow-sm">
        {label}
      </div>
      
      {children}
    </div>
  );
};

export default VehicleIcon;
