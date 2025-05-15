
import { toast } from "sonner";

export { toast };

// Create a useToast hook that returns the toast function
export const useToast = () => {
  return { toast };
};
