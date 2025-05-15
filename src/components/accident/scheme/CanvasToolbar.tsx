
import { Button } from "@/components/ui/button";
import { 
  Car, Truck, Bike, Undo, Redo, ZoomIn, ZoomOut, Download, MapPin, 
  PlusCircle 
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  currentVehicleType?: 'car' | 'truck' | 'bike';
  onChangeVehicleType?: (type: 'car' | 'truck' | 'bike') => void;
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
  canRedo,
  currentVehicleType = 'car',
  onChangeVehicleType 
}: CanvasToolbarProps) => {
  const handleVehicleTypeChange = (value: string) => {
    if (onChangeVehicleType && (value === 'car' || value === 'truck' || value === 'bike')) {
      onChangeVehicleType(value as 'car' | 'truck' | 'bike');
    }
  };

  const getVehicleIcon = () => {
    switch (currentVehicleType) {
      case 'truck':
        return <Truck className="w-4 h-4 mr-2" />;
      case 'bike':
        return <Bike className="w-4 h-4 mr-2" />;
      default:
        return <Car className="w-4 h-4 mr-2" />;
    }
  };

  const getVehicleLabel = () => {
    switch (currentVehicleType) {
      case 'truck':
        return 'Camion';
      case 'bike':
        return 'Moto';
      default:
        return 'Voiture';
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          {onChangeVehicleType && (
            <Select value={currentVehicleType} onValueChange={handleVehicleTypeChange}>
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Type de véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Voiture
                  </div>
                </SelectItem>
                <SelectItem value="truck">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Camion
                  </div>
                </SelectItem>
                <SelectItem value="bike">
                  <div className="flex items-center">
                    <Bike className="w-4 h-4 mr-2" />
                    Moto
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onAddVehicle}>
                {getVehicleIcon()}
                <span className="hidden sm:inline">Ajouter {getVehicleLabel()}</span>
                <span className="sm:hidden"><PlusCircle size={16} /></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cliquez pour ajouter un véhicule au centre de la carte</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {onCenterVehicles && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onCenterVehicles}>
                <MapPin className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Centrer</span>
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
    </TooltipProvider>
  );
};

export default CanvasToolbar;
