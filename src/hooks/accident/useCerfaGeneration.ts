
import { useState } from 'react';
import { toast } from 'sonner';
import { FormData } from '@/components/accident/types';
import { useRegisterReport, RegisterReportResult } from '@/hooks/accident/useRegisterReport';
import { generatePDF, downloadPDF } from '@/utils/pdfGeneratorUtils';
import { captureStageAsDataUrl } from '@/components/accident/scheme/SchemeExport';

interface UseCerfaGenerationProps {
  formData: FormData;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCerfaGeneration = ({ formData, onSuccess, onError }: UseCerfaGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Nous utilisons uniquement ce que nous avons besoin du hook useRegisterReport
  const { isRegistering, registrationSuccess }: Partial<RegisterReportResult> = useRegisterReport();

  const generateCerfa = async (schemeImageDataUrl?: string | null): Promise<string> => {
    setIsGenerating(true);
    
    try {
      // Si aucune image n'est fournie, tenter de capturer le schéma
      if (!schemeImageDataUrl) {
        schemeImageDataUrl = await captureStageAsDataUrl();
      }
      
      // Génère le PDF avec les données du formulaire
      const url = await generatePDF(formData, schemeImageDataUrl);
      setPdfUrl(url);
      return url;
    } catch (error) {
      console.error('Erreur lors de la génération du CERFA:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCerfa = async (): Promise<boolean> => {
    try {
      // Utiliser l'URL existant ou en générer un nouveau
      const url = pdfUrl || await generateCerfa();
      
      // Télécharger le PDF
      return await downloadPDF(url, 'constat-amiable.pdf');
    } catch (error) {
      console.error('Erreur lors du téléchargement du CERFA:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    }
  };

  return {
    isGenerating,
    pdfUrl,
    generateCerfa,
    downloadCerfa
  };
};
