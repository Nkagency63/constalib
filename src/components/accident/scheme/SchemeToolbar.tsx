
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MapPin, Car, Flag } from 'lucide-react';

interface SchemeToolbarProps {
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  setCurrentTool: (tool: 'select' | 'vehicle' | 'path' | 'annotation') => void;
}

const SchemeToolbar = ({ currentTool, setCurrentTool }: SchemeToolbarProps) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-md shadow-md p-2 flex flex-col gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={currentTool === 'select' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('select')}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 17 9 4 9-4"/>
              <path d="m3 7 9 4 9-4"/>
              <path d="M3 12h18"/>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mode sélection</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={currentTool === 'vehicle' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('vehicle')}
            className="flex items-center"
          >
            <Car className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ajouter un véhicule</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={currentTool === 'path' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('path')}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m7 17 4-4 4 4 6-6" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tracer une trajectoire</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={currentTool === 'annotation' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('annotation')}
            className="flex items-center"
          >
            <Flag className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ajouter une annotation</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SchemeToolbar;
