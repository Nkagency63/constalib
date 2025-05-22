
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
  // Définition des outils avec leurs icônes et descriptions
  const tools = [
    {
      id: 'select',
      label: 'Mode sélection',
      description: 'Sélectionner et déplacer les éléments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 17 9 4 9-4"/>
          <path d="m3 7 9 4 9-4"/>
          <path d="M3 12h18"/>
        </svg>
      )
    },
    {
      id: 'vehicle',
      label: 'Ajouter un véhicule',
      description: 'Placer un nouveau véhicule sur la carte',
      icon: <Car className="w-4 h-4" />
    },
    {
      id: 'path',
      label: 'Tracer une trajectoire',
      description: 'Dessiner le parcours d\'un véhicule',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m7 17 4-4 4 4 6-6" />
        </svg>
      )
    },
    {
      id: 'annotation',
      label: 'Ajouter une annotation',
      description: 'Placer une note sur la carte',
      icon: <Flag className="w-4 h-4" />
    }
  ];

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 border border-gray-200">
      {tools.map(tool => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={currentTool === tool.id as any ? 'default' : 'outline'}
              onClick={() => setCurrentTool(tool.id as any)}
              className="flex items-center justify-center"
              aria-label={tool.label}
            >
              {tool.icon}
              <span className="sr-only">{tool.label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col">
            <p className="font-medium">{tool.label}</p>
            <p className="text-xs text-gray-500">{tool.description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default SchemeToolbar;
