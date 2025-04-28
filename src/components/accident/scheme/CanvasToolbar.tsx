
import { Button } from "@/components/ui/button";
import { Car, Undo, Redo, ZoomIn, ZoomOut, Download, MapPin } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface CanvasToolbarProps {
  onAddVehicle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExportImage?: () => void;
  onCenterVehicles?: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CanvasToolbar = ({ 
  onAddVehicle, 
  onUndo, 
  onRedo, 
  onZoomIn, 
  onZoomOut,
  onExportImage,
  onCenterVehicles,
  canUndo,
  canRedo 
}: CanvasToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white border-b border-gray-200">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={onAddVehicle}>
            <Car className="w-4 h-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cliquez pour ajouter un véhicule au centre de la carte</p>
        </TooltipContent>
      </Tooltip>
      
      {onCenterVehicles && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onCenterVehicles}>
              <MapPin className="w-4 h-4 mr-2" />
              Centrer
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Centrer la carte sur tous les véhicules</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onUndo} 
              disabled={!canUndo}
            >
              <Undo className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Annuler la dernière action</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRedo} 
              disabled={!canRedo}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rétablir la dernière action</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom avant</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom arrière</p>
          </TooltipContent>
        </Tooltip>
        
        {onExportImage && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onExportImage}>
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exporter en image</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default CanvasToolbar;
