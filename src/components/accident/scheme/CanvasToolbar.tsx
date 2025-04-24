
import { Button } from "@/components/ui/button";
import { Car, Trash2, Pencil } from 'lucide-react';

interface CanvasToolbarProps {
  drawing: boolean;
  onToggleDrawing: () => void;
  onClear: () => void;
  onAddVehicle?: () => void;
}

const CanvasToolbar = ({ 
  drawing, 
  onToggleDrawing, 
  onClear,
  onAddVehicle
}: CanvasToolbarProps) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-2 bg-white/80 p-1 rounded-md">
      {onAddVehicle && (
        <Button 
          variant="outline"
          size="sm" 
          onClick={onAddVehicle} 
          className="bg-white"
        >
          <Car className="w-4 h-4 mr-1" />
          <span>Véhicule</span>
        </Button>
      )}
      
      <Button 
        variant={drawing ? "default" : "outline"}
        size="sm" 
        onClick={onToggleDrawing}
        className={drawing ? "" : "bg-white"}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClear}
        className="bg-white"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CanvasToolbar;
