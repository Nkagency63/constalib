
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VehicleControlsProps {
  vehicleId: string;
  onRemove: (vehicleId: string) => void;
}

const VehicleControls = ({ vehicleId, onRemove }: VehicleControlsProps) => {
  return (
    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1">
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
