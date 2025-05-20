
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRegisterReport } from "@/hooks/accident/useRegisterReport";
import { toast } from "sonner";
import { FormData } from "./types";
import { AlertDialog } from "@/components/ui/alert-dialog";
import SignatureDialog from "./SignatureDialog";
import OfficialReportDialog from "./pdf/OfficialReportDialog";
import useCerfaGeneration from "@/hooks/accident/useCerfaGeneration";

interface FormSubmissionHandlerProps {
  formData: FormData;
  onSubmitSuccess: () => void;
}

const FormSubmissionHandler: React.FC<FormSubmissionHandlerProps> = ({
  formData,
  onSubmitSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatures, setSignatures] = useState<{ partyA: string | null, partyB: string | null }>({
    partyA: null,
    partyB: null
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  
  const { registerReport } = useRegisterReport();
  const { generatePdf } = useCerfaGeneration({ 
    formData,
    signatures,
    onSuccess: onSubmitSuccess
  });

  const handleGenerateReport = async () => {
    setIsSubmitting(true);
    try {
      // Register the report
      const result = await registerReport(formData);
      
      // Show success toast and set success state
      toast.success("Votre constat a été enregistré avec succès!");
      setRegistrationSuccess(true);
      setReferenceId("REF-" + Math.random().toString(36).substring(2, 10).toUpperCase());
      
      // Generate PDF with signatures
      await generatePdf();
      
      // Call the success callback
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du constat:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'enregistrement du constat";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSignatureModal = () => {
    setShowSignatureModal(true);
  };

  const handleSignaturesComplete = (signatures: { partyA: string, partyB: string }) => {
    setSignatures(signatures);
    setShowSignatureModal(false);
    setShowConfirmDialog(true);
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleOpenSignatureModal}
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enregistrement en cours..." : "Finaliser le constat"}
      </Button>
      
      <SignatureDialog 
        open={showSignatureModal} 
        onOpenChange={setShowSignatureModal}
        onSignaturesComplete={handleSignaturesComplete}
      />
      
      <OfficialReportDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleGenerateReport}
        isProcessing={isSubmitting}
        referenceId={referenceId}
        isSuccess={registrationSuccess}
      />
    </div>
  );
};

export default FormSubmissionHandler;
