
import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  return (
    <Button 
      type="button" 
      variant={variant}
      className="whitespace-nowrap"
      onClick={onClick}
      disabled={isLoading || disabled}
      title={tooltip}
    >
      {isLoading ? 
        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
        <Icon className="h-4 w-4 mr-2" />
      }
      {label}
    </Button>
  );
};

export default ActionButton;
