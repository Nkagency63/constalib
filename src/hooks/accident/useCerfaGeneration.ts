
import { useState } from 'react';
import { FormData } from "@/components/accident/types";
import { useGeneratePdf } from './useGeneratePdf';
import { useRegisterReport } from './useRegisterReport';

interface UseCerfaGenerationProps {
  formData: FormData;
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  };
}

export const useCerfaGeneration = ({ formData, signatures }: UseCerfaGenerationProps) => {
  const [referenceId, setReferenceId] = useState<string | null>(null);
  
  // Use the PDF generation hook
  const {
    isGenerating,
    handleGenerateCerfa
  } = useGeneratePdf({ formData, signatures });
  
  // Use the registration hook only if signatures are provided
  const {
    isRegistering,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId: registrationReferenceId,
    handleRegisterOfficial
  } = useRegisterReport({ 
    formData, 
    signatures: signatures || { partyA: null, partyB: null } 
  });
  
  // Update local reference ID when registration is successful
  if (registrationReferenceId && registrationReferenceId !== referenceId) {
    setReferenceId(registrationReferenceId);
  }

  return {
    isGenerating,
    isRegistering,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    handleGenerateCerfa: async () => {
      const result = await handleGenerateCerfa();
      
      // Set referenceId if signatures were provided (official document)
      if (result && signatures?.partyA && signatures?.partyB) {
        setReferenceId("CR-" + Math.random().toString(36).substring(2, 9));
      }
      
      return result;
    },
    handleRegisterOfficial: async () => {
      if (!signatures?.partyA || !signatures?.partyB) {
        return;
      }
      
      // First generate the PDF to get the scheme image
      const result = await handleGenerateCerfa();
      if (result) {
        // Then register the report with the scheme image
        await handleRegisterOfficial(result.schemeImageDataUrl);
      }
    },
    canRegisterOfficial: Boolean(signatures?.partyA && signatures?.partyB)
  };
};
