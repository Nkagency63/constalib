
import { Toaster } from './ui/toaster';
import { Toaster as SonnerToaster } from "./ui/sonner";

/**
 * ToastHandler component that handles all toast notifications in the application
 * It includes both shadcn/ui Toaster and Sonner Toaster for different toast styling options
 */
const ToastHandler = () => {
  return (
    <>
      {/* ShadCN Toaster - for traditional toast messages */}
      <Toaster />
      
      {/* Sonner Toaster - for more modern toast styling */}
      <SonnerToaster position="top-right" />
    </>
  );
};

export default ToastHandler;
