
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.5 8.5 5.5 8.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z"/>
              <path d="M15 8.5V5a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v3.5"/>
              <line x1="3" x2="21" y1="12.5" y2="12.5"/>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ajouter un véhicule</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SchemeToolbar;
