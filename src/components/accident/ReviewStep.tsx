
import React, { useState } from 'react';
import { toast } from 'sonner';
import { FormData, SchemeData } from './types';
import { useRegisterReport } from '@/hooks/accident/useRegisterReport';
import CerfaGenerationButton from './CerfaGenerationButton';

interface ReviewStepProps {
  formData: FormData;
  onSubmitSuccess?: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerReport } = useRegisterReport();

  // Fix onSubmitSuccess and error handling in handleGenerateReport
  const handleGenerateReport = async () => {
    setIsSubmitting(true);
    try {
      await registerReport(formData);
      toast.success("Votre constat a été enregistré avec succès!");
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

  return (
    <div className="space-y-6">
      <CerfaGenerationButton 
        formData={formData}
        className="w-full mt-4"
        text="Générer le PDF du constat amiable"
      />
    </div>
  );
};

export default ReviewStep;
