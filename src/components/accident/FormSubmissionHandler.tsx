
import { useState } from 'react';
import { useRegisterReport } from '@/hooks/accident/useRegisterReport';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OfficialReportDialog from './pdf/OfficialReportDialog';
import { Check, FileText, Shield, Upload } from 'lucide-react';
import { useCerfaGeneration } from '@/hooks/accident/useCerfaGeneration';

interface FormSubmissionHandlerProps {
  formData: any;
  onSubmitSuccess: () => void;
}

const FormSubmissionHandler = ({ formData, onSubmitSuccess }: FormSubmissionHandlerProps) => {
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<Error | null>(null);

  const { 
    registerReport, 
    isRegistering, 
    reportId,
    isSuccess,
    isError,
    error
  } = useRegisterReport({
    formData,
    onSuccess: () => {
      setRegistrationSuccess(true);
      setReferenceId(reportId);
      onSubmitSuccess();
    },
    onError: (err) => {
      setRegistrationError(err);
    }
  });

  const { generatePdf, isGenerating } = useCerfaGeneration({ 
    formData,
    onSuccess: () => {
      toast.success('Document PDF généré', {
        description: 'Le constat amiable a été téléchargé'
      });
    }
  });

  const handleRegistrationClick = async () => {
    setShowOfficialDialog(true);
  };

  const handleConfirmRegistration = async () => {
    try {
      await registerReport();
      // Remarque: onSuccess du hook useRegisterReport sera appelé en cas de succès
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur d\'enregistrement', {
        description: 'Une erreur est survenue lors de l\'enregistrement du constat'
      });
    } finally {
      setShowOfficialDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={generatePdf} 
          className="flex items-center justify-center"
          disabled={isGenerating}
          variant="outline"
        >
          <FileText className="h-5 w-5 mr-2" />
          {isGenerating ? 'Génération...' : 'Télécharger le CERFA'}
        </Button>
        
        <Button 
          onClick={handleRegistrationClick}
          className="flex items-center justify-center"
          disabled={isRegistering || registrationSuccess}
          variant="default"
        >
          {registrationSuccess ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Enregistrement confirmé
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              {isRegistering ? 'Enregistrement...' : 'Enregistrer officiellement'}
            </>
          )}
        </Button>
      </div>
      
      <OfficialReportDialog 
        open={showOfficialDialog}
        onOpenChange={setShowOfficialDialog}
        onConfirm={handleConfirmRegistration}
        isProcessing={isRegistering}
        referenceId={referenceId}
        isSuccess={registrationSuccess}
      />
    </div>
  );
};

export default FormSubmissionHandler;
