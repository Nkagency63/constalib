
import React from 'react';
import { Toaster } from 'sonner';

const ToastHandler = () => {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        style: {
          background: '#fff',
          color: '#363636',
        },
        duration: 4000,
        className: 'my-toast-class',
      }}
    />
  );
};

export default ToastHandler;
