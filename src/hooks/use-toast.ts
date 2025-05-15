
import { toast as sonnerToast } from "sonner";

// Re-export the toast function
export const toast = sonnerToast;

// Create a useToast hook that returns the toast function
export const useToast = () => {
  return { toast: sonnerToast };
};
