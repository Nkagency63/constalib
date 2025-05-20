
import { useState } from 'react';
import { generateCerfaPDF } from '@/utils/cerfa';
import { useRegisterReport } from './useRegisterReport';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

interface UseCerfaGenerationProps {
  formData: any;
  onSuccess?: () => void;
}

export const useCerfaGeneration = ({ formData, onSuccess }: UseCerfaGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Utiliser le hook pour l'enregistrement officiel du rapport
  const { 
    registerReport, 
    isRegistering, 
    reportId, 
    isSuccess, 
    isError, 
    error, 
    registrationSuccess, 
    registrationError,
    referenceId,
    showOfficialDialog,
    setShowOfficialDialog,
    setReferenceId
  } = useRegisterReport({ 
    formData,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    }
  });

  // Générer le PDF du constat
  const generatePdf = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      
      const pdfBlob = await generateCerfaPDF(formData);
      
      // Créer une URL pour le blob
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      // Télécharger automatiquement le PDF
      saveAs(pdfBlob, `Constat_Amiable_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast.success('PDF généré avec succès', {
        description: 'Le document a été téléchargé automatiquement'
      });
      
      return pdfBlob;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      setErrorMessage('Une erreur est survenue lors de la génération du PDF');
      
      toast.error('Erreur de génération', {
        description: 'Impossible de générer le PDF. Veuillez réessayer.'
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePdf,
    registerReport,
    isGenerating,
    isRegistering,
    pdfUrl,
    errorMessage,
    reportId,
    isSuccess,
    isError,
    error,
    registrationSuccess,
    registrationError,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    setReferenceId
  };
};
