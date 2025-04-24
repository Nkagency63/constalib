
import { Car } from 'lucide-react';
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
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-constalib-blue' : ''}`}
      style={style}
      onMouseDown={onMouseDown}
    >
      <div
        className="w-16 h-32 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: color }}
      >
        <Car className="w-8 h-8 text-white" />
      </div>
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-constalib-dark-gray bg-white px-1 rounded">
        {label}
      </div>
      
      {children}
    </div>
  );
};

export default VehicleIcon;
