
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, AlertTriangle } from 'lucide-react';
import { useCerfaGeneration } from '@/hooks/accident/useCerfaGeneration';
import { FormData } from './types';
import { Alert, AlertDescription } from "@/components/ui/alert";
import SignatureDialog from './SignatureDialog';
import OfficialRegistrationDialog from './OfficialRegistrationDialog';

interface FormSubmissionHandlerProps {
  formData: FormData;
  onSubmitSuccess: () => void;
}

const FormSubmissionHandler = ({ formData, onSubmitSuccess }: FormSubmissionHandlerProps) => {
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signatures, setSignatures] = useState<{ partyA: string | null; partyB: string | null; }>({
    partyA: null,
    partyB: null,
  });
  
  const {
    isGenerating,
    isRegistering,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    handleGenerateCerfa,
    handleRegisterOfficial,
    canRegisterOfficial
  } = useCerfaGeneration({ formData, signatures });

  return (
    <div className="flex flex-col gap-4">
      {referenceId && (
        <Alert className="bg-green-100 border-green-200 text-green-800">
          <AlertDescription>
            Votre constat a été enregistré officiellement avec la référence <strong>{referenceId}</strong>.
          </AlertDescription>
        </Alert>
      )}
      
      {!formData.date && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Les informations de base (date et lieu) sont manquantes. Veuillez les compléter avant de soumettre le formulaire.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button 
          onClick={handleGenerateCerfa}
          disabled={isGenerating}
          className="flex items-center justify-center"
          variant="default"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-5 w-5" />
              Télécharger au format PDF
            </>
          )}
        </Button>
        
        <Button 
          onClick={() => setShowSignatureDialog(true)}
          disabled={isGenerating || isRegistering}
          className="flex items-center justify-center"
        >
          Ajouter des signatures
        </Button>
        
        {canRegisterOfficial && (
          <Button
            onClick={() => setShowOfficialDialog(true)}
            disabled={isGenerating || isRegistering}
            className="flex items-center justify-center"
          >
            Enregistrer officiellement
          </Button>
        )}
      </div>
      
      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        onSign={(partyA: string | null, partyB: string | null) => {
          setSignatures({ partyA, partyB });
        }}
      />
      
      <OfficialRegistrationDialog
        open={showOfficialDialog}
        onOpenChange={setShowOfficialDialog}
        onRegister={handleRegisterOfficial}
        isRegistering={isRegistering}
      />
    </div>
  );
};

export default FormSubmissionHandler;
