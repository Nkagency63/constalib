
import { toast as sonnerToast, type ToastT } from "sonner";

// Re-export the toast function
export const toast = sonnerToast;

// Create a useToast hook that returns the toast function
export const useToast = () => {
  return { toast: sonnerToast };
};

// Re-export types to make them available where needed
export type Toast = ToastT;
