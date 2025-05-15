
// Re-export from sonner for backward compatibility
import { toast } from 'sonner';
import { useToast as useCustomToast } from "@/hooks/use-toast";

export { toast, useCustomToast as useToast };
