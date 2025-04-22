
import React from 'react';
import { Car, Plus, Minus, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onAddVehicle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
}

const MapControls = ({
  onAddVehicle,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  isUndoDisabled,
  isRedoDisabled
}: MapControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={onAddVehicle}>
        <Car className="w-4 h-4 mr-2" />
        Ajouter un véhicule
      </Button>
      
      <div className="ml-auto flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onUndo} 
          disabled={isUndoDisabled}
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRedo} 
          disabled={isRedoDisabled}
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

export default MapControls;
