
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
  return (
    <>
      {searchError && searchTab === 'siv' && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}
      
      {fniError && searchTab === 'fni' && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fniError}</AlertDescription>
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
