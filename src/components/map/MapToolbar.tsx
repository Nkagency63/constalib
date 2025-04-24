
import { Button } from '../ui/button';
import { Car, Undo, Redo, Plus, Minus } from 'lucide-react';

interface MapToolbarProps {
  onAddVehicle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const MapToolbar = ({
  onAddVehicle,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  canUndo,
  canRedo,
}: MapToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Button variant="outline" onClick={onAddVehicle}>
        <Car className="w-4 h-4 mr-2" />
        Ajouter un véhicule
      </Button>
      
      <div className="ml-auto flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onUndo} 
          disabled={!canUndo}
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRedo} 
          disabled={!canRedo}
        >
          <Redo className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onZoomIn}>
          <Plus className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onZoomOut}>
          <Minus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapToolbar;
