
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flag, MapPin, Car } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MapToolsProps {
  selectedTool: 'arrow' | 'impact' | 'sign' | null;
  onToolSelect: (tool: 'arrow' | 'impact' | 'sign' | null) => void;
}

const MapTools = ({ selectedTool, onToolSelect }: MapToolsProps) => {
  const tools = [
    {
      id: 'arrow' as const,
      icon: ArrowRight,
      tooltip: 'Flèches de direction',
    },
    {
      id: 'impact' as const,
      icon: Flag,
      tooltip: 'Zones d\'impact',
    },
    {
      id: 'sign' as const,
      icon: MapPin,
      tooltip: 'Signalisation (stop, feu rouge, priorité...)',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === tool.id ? 'default' : 'outline'}
                size="sm"
                className="relative"
                onClick={() => onToolSelect(selectedTool === tool.id ? null : tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => {}} // Will be implemented in a future PR
            >
              <Car className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ajouter un véhicule</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MapTools;
