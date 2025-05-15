
import { toast as sonnerToast, type ToastT } from "sonner";

// Define the toast action type
export type ToastAction = {
  label: string;
  onClick: () => void;
};

// Define the toast props type
export type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastAction;
  variant?: "default" | "destructive";
};

// Create a toast function that wraps sonner
export const toast = ({ title, description, action, variant }: ToastProps) => {
  return sonnerToast(title || "", {
    description,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : ""
  });
};

// Export the useToast hook without recursion
export const useToast = () => {
  return {
    toast,
  };
};
