
import { RotateCcw, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleControlsProps {
  vehicleId: string;
  onRemove: (vehicleId: string) => void;
  onRotate?: (vehicleId: string, angle: number) => void;
}

const VehicleControls = ({ vehicleId, onRemove, onRotate }: VehicleControlsProps) => {
  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white p-1 rounded-lg shadow-lg">
      {onRotate && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRotate(vehicleId, -45)}
            title="Rotation anti-horaire"
          >
            <RotateCcw className="h-4 w-4 text-constalib-dark" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRotate(vehicleId, 45)}
            title="Rotation horaire"
          >
            <RotateCw className="h-4 w-4 text-constalib-dark" />
          </Button>
        </>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => onRemove(vehicleId)}
        title="Supprimer"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VehicleControls;
