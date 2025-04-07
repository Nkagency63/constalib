
import React from 'react';
import { Loader2, Search, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
    <Button 
      type="button" 
      size="icon"
      variant={variant}
      className={variant === "ghost" ? "absolute right-2 top-1/2 transform -translate-y-1/2" : ""}
      onClick={onClick}
      disabled={isLoading || disabled}
      title={tooltip}
    >
      {isLoading ? 
        <Loader2 className="h-5 w-5 animate-spin text-constalib-blue" /> : 
        lookupSuccess ? 
          <Check className="h-5 w-5 text-green-600" /> :
          <Search className="h-5 w-5 text-constalib-blue" />
      }
    </Button>
  );
};

export default LookupButton;
