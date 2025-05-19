
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRegisterReport } from '@/hooks/accident/useRegisterReport';
import { FormData } from './types';

interface CerfaGenerationButtonProps {
  formData: FormData;
  onSuccess?: () => void;
}

const CerfaGenerationButton: React.FC<CerfaGenerationButtonProps> = ({ 
  formData,
  onSuccess 
}) => {
  const { 
    registerReport, 
    isRegistering, 
    registrationError,
    showOfficialDialog, 
    setShowOfficialDialog,
    referenceId
  } = useRegisterReport();

  const handleSubmitReport = async () => {
    const success = await registerReport(formData);
    
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      {registrationError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-sm text-red-700">{registrationError}</p>
          </div>
        </div>
      )}
      
      <Button
        onClick={handleSubmitReport}
        disabled={isRegistering}
        className="w-full bg-constalib-blue hover:bg-constalib-dark-blue"
      >
        {isRegistering ? 'Génération en cours...' : 'Générer mon constat amiable'}
      </Button>
    </div>
  );
};

export default CerfaGenerationButton;
