
import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster } from "@/components/ui/toaster";

const ToastHandler = () => {
  return (
    <>
      <SonnerToaster position="top-right" />
      <Toaster />
    </>
  );
};

export default ToastHandler;
