
import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
  Icon: LucideIcon;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  tooltip?: string;
}

const ActionButton = ({
  isLoading,
  onClick,
  disabled = false,
  Icon,
  label,
  variant = "default",
  tooltip
}: ActionButtonProps) => {
  const button = (
    <Button 
      type="button" 
      variant={variant}
      className="whitespace-nowrap"
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? 
        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
        <Icon className="h-4 w-4 mr-2" />
      }
      {label}
    </Button>
  );
  
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
};

export default ActionButton;
