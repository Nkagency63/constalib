import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Pencil, MessageSquare, MousePointer, Plus, Undo, Redo, Trash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';

interface SchemeToolbarsProps {
  readOnly?: boolean;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  setCurrentTool: (tool: 'select' | 'vehicle' | 'path' | 'annotation') => void;
  onAddVehicle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  vehicles: any[];
  paths: any[];
  annotations: any[];
  handleUndo: () => void;
  handleRedo: () => void;
  setVehicles: (vehicles: any[]) => void;
  setPaths: (paths: any[]) => void;
  setAnnotations: (annotations: any[]) => void;
  centerOnVehicles: () => void;
  mapRef: React.MutableRefObject<L.Map | null>;
  currentVehicleType: 'car' | 'truck' | 'bike';
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  pathColor: string;
  setPathColor: (color: string) => void;
}

const SchemeToolbars: React.FC<SchemeToolbarsProps> = ({
  readOnly = false,
  currentTool,
  setCurrentTool,
  onAddVehicle,
  canUndo,
  canRedo,
  vehicles,
  paths,
  annotations,
  handleUndo,
  handleRedo,
  centerOnVehicles,
  currentVehicleType,
  onChangeVehicleType,
  pathColor,
  setPathColor
}) => {
  return (
    <div className="scheme-toolbar bg-white p-2 rounded-lg border border-gray-200 mb-2 flex flex-wrap gap-2 items-center">
      <div className="tools-group flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle 
              pressed={currentTool === 'select'}
              onPressedChange={() => setCurrentTool('select')}
              disabled={readOnly}
              className={`p-2 h-9 w-9 ${currentTool === 'select' ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Outil de sélection"
            >
              <MousePointer className="h-5 w-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Sélection</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle 
              pressed={currentTool === 'vehicle'}
              onPressedChange={() => setCurrentTool('vehicle')}
              disabled={readOnly}
              className={`p-2 h-9 w-9 ${currentTool === 'vehicle' ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Ajouter un véhicule"
            >
              <Car className="h-5 w-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Véhicule</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle 
              pressed={currentTool === 'path'}
              onPressedChange={() => setCurrentTool('path')}
              disabled={readOnly}
              className={`p-2 h-9 w-9 ${currentTool === 'path' ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Tracer une trajectoire"
            >
              <Pencil className="h-5 w-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Trajectoire</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle 
              pressed={currentTool === 'annotation'}
              onPressedChange={() => setCurrentTool('annotation')}
              disabled={readOnly}
              className={`p-2 h-9 w-9 ${currentTool === 'annotation' ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Ajouter une annotation"
            >
              <MessageSquare className="h-5 w-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Annotation</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="divider border-l h-8 mx-1 border-gray-200"></div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={centerOnVehicles}
        disabled={vehicles.length === 0}
        className="flex gap-1 items-center text-xs"
      >
        <Car className="h-4 w-4" /> Centrer sur les véhicules
      </Button>
      
      {/* Other buttons can be added here like color picker, vehicle type selector, etc. */}
    </div>
  );
};

export default SchemeToolbars;
