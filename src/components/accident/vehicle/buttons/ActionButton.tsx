
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
  Icon: React.ElementType;
  label: string;
  variant?: "outline" | "default" | "secondary" | "destructive" | "ghost" | "link";
  tooltip?: string;
}

const ActionButton = ({
  isLoading,
  onClick,
  disabled = false,
  Icon,
  label,
  variant = "outline",
  tooltip
}: ActionButtonProps) => {
  const button = (
    <Button 
      type="button" 
      variant={variant}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="flex items-center gap-2"
    >
      {isLoading ? 
        <Loader2 className="h-4 w-4 animate-spin" /> : 
        <Icon className="h-4 w-4" />
      }
      <span>{label}</span>
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
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default ActionButton;
