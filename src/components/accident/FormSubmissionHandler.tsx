
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRegisterReport } from '@/hooks/accident/useRegisterReport';
import { FormData } from './types';
import CerfaGenerationButton from './CerfaGenerationButton';

interface FormSubmissionHandlerProps {
  formData: FormData;
  onSubmitSuccess?: () => void;
}

const FormSubmissionHandler: React.FC<FormSubmissionHandlerProps> = ({ 
  formData,
  onSubmitSuccess 
}) => {
  const { 
    registerReport, 
    isRegistering, 
    registrationError, 
    registrationSuccess,
    showOfficialDialog, 
    setShowOfficialDialog,
    referenceId
  } = useRegisterReport();

  const handleSubmit = async () => {
    const success = await registerReport(formData);
    
    if (success && onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
        <CheckCircle2 className="h-5 w-5 text-constalib-blue flex-shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="font-medium text-constalib-dark">Prêt à générer votre constat amiable</h4>
          <p className="text-sm text-constalib-dark-gray">
            Vérifiez que toutes les informations saisies sont correctes avant de générer 
            votre constat. Après génération, vous recevrez une copie par email et pourrez 
            le télécharger au format PDF.
          </p>
        </div>
      </div>
      
      {registrationError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-sm text-red-700">{registrationError}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {!registrationSuccess ? (
          <Button
            onClick={handleSubmit}
            disabled={isRegistering}
            className="w-full bg-constalib-blue hover:bg-constalib-dark-blue"
            size="lg"
          >
            {isRegistering ? 'Génération en cours...' : 'Générer mon constat amiable'}
          </Button>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="font-medium text-constalib-dark">Constat généré avec succès</h4>
              <p className="text-sm text-constalib-dark-gray">
                Votre constat a été généré avec succès. Votre numéro de référence est: <strong>{referenceId}</strong>
              </p>
              <Button 
                className="mt-2"
                variant="outline"
                onClick={() => toast.success("Le constat a été envoyé à votre adresse email")}
              >
                Télécharger mon constat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSubmissionHandler;
