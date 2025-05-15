
import React from 'react';
import { Loader2, Search, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LookupButtonProps {
  isLoading: boolean;
  lookupSuccess: boolean;
  onClick: () => void;
  variant?: "ghost" | "default";
  tooltip: string;
  disabled?: boolean;
}

const LookupButton = ({
  isLoading,
  lookupSuccess,
  onClick,
  variant = "ghost",
  tooltip,
  disabled = false
}: LookupButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            type="button" 
            size="icon"
            variant={variant}
            className={variant === "ghost" ? "absolute right-2 top-1/2 transform -translate-y-1/2" : ""}
            onClick={onClick}
            disabled={isLoading || disabled}
          >
            {isLoading ? 
              <Loader2 className="h-5 w-5 animate-spin text-constalib-blue" /> : 
              lookupSuccess ? 
                <Check className="h-5 w-5 text-green-600" /> :
                <Search className="h-5 w-5 text-constalib-blue" />
            }
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LookupButton;
