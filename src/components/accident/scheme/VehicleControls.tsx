
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VehicleControlsProps {
  vehicleId: string;
  onRotate: (vehicleId: string, angle: number) => void;
  onRemove: (vehicleId: string) => void;
}

const VehicleControls = ({ vehicleId, onRotate, onRemove }: VehicleControlsProps) => {
  return (
    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1">
      <button
        className="bg-white p-1 rounded-full shadow-sm text-constalib-dark-gray hover:bg-constalib-light-blue"
        onClick={() => onRotate(vehicleId, -45)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 15L8 11L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <button
        className="bg-white p-1 rounded-full shadow-sm text-constalib-dark-gray hover:bg-constalib-light-blue"
        onClick={() => onRotate(vehicleId, 45)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 15L16 11L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <button
        className="bg-white p-1 rounded-full shadow-sm text-red-500 hover:bg-red-50"
        onClick={() => onRemove(vehicleId)}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default VehicleControls;
