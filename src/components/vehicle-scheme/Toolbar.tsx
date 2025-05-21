
import React from 'react';
import { Car, Undo2, Redo2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onAddVehicle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar = ({
  onAddVehicle,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  canUndo,
  canRedo
}: ToolbarProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button 
        variant="outline"
        size="sm" 
        onClick={onAddVehicle}
        className="flex items-center"
      >
        <Car className="h-4 w-4 mr-2" />
        Ajouter véhicule
      </Button>
      
      <div className="grow"></div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
