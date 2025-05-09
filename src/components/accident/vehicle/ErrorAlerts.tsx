
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorAlertsProps {
  searchError: string | null;
  fniError: string | null;
  fvaError: string | null;
  searchTab: 'siv' | 'fni';
}

const ErrorAlerts = ({
  searchError,
  fniError,
  fvaError,
  searchTab
}: ErrorAlertsProps) => {
  const currentError = searchTab === 'siv' ? searchError : fniError;
  
  return (
    <>
      {currentError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{currentError}</AlertDescription>
        </Alert>
      )}
      
      {fvaError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fvaError}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ErrorAlerts;
