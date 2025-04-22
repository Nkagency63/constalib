
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapErrorProps {
  error: string;
  onRetry: () => void;
}

const MapError = ({ error, onRetry }: MapErrorProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-4">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-red-600 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline">
        <RefreshCcw className="w-4 h-4 mr-2" />
        Réessayer
      </Button>
    </div>
  );
};

export default MapError;
