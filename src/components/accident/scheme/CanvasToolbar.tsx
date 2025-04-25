
import { Button } from "@/components/ui/button";
import { Car, Undo, Redo, Plus, Minus, Download } from 'lucide-react';

interface CanvasToolbarProps {
  onAddVehicle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CanvasToolbar = ({ 
  onAddVehicle, 
  onUndo, 
  onRedo, 
  onZoomIn, 
  onZoomOut,
  canUndo,
  canRedo 
}: CanvasToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white border-b border-gray-200">
      <Button variant="outline" size="sm" onClick={onAddVehicle}>
        <Car className="w-4 h-4 mr-2" />
        Ajouter un véhicule
      </Button>
      
      <div className="ml-auto flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onUndo} 
          disabled={!canUndo}
          title="Annuler"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRedo} 
          disabled={!canRedo}
          title="Rétablir"
        >
          <Redo className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onZoomIn} title="Zoom avant">
          <Plus className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onZoomOut} title="Zoom arrière">
          <Minus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
