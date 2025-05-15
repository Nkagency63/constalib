
import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
  Icon: LucideIcon;
  label: string;
  variant?: "default" | "outline";
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
  return (
    <Button
      type="button"
      variant={variant}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="shrink-0"
      title={tooltip}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Icon className="h-4 w-4 mr-2" />
      )}
      {label}
    </Button>
  );
};

export default ActionButton;
