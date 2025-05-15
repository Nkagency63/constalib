
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  MousePointer, 
  Car, 
  Route as RouteIcon, 
  StickyNote 
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SchemeToolbarProps {
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  onSelect: () => void;
  onAddVehicle: () => void;
  onAddPath: () => void;
  onAddAnnotation: () => void;
}

const SchemeToolbar = ({ 
  currentTool, 
  onSelect, 
  onAddVehicle, 
  onAddPath, 
  onAddAnnotation 
}: SchemeToolbarProps) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 bg-white rounded-lg shadow-lg p-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentTool === 'select' ? 'default' : 'outline'}
            size="icon"
            onClick={onSelect}
            className="w-8 h-8"
          >
            <MousePointer className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Sélectionner</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentTool === 'vehicle' ? 'default' : 'outline'}
            size="icon"
            onClick={onAddVehicle}
            className="w-8 h-8"
          >
            <Car className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Ajouter un véhicule</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentTool === 'path' ? 'default' : 'outline'}
            size="icon"
            onClick={onAddPath}
            className="w-8 h-8"
          >
            <RouteIcon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tracer une trajectoire</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentTool === 'annotation' ? 'default' : 'outline'}
            size="icon"
            onClick={onAddAnnotation}
            className="w-8 h-8"
          >
            <StickyNote className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Ajouter une annotation</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SchemeToolbar;
