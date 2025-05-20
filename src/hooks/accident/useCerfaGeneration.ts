
import { useState } from 'react';
import { toast } from 'sonner';
import { FormData } from '@/components/accident/types';
import { useRegisterReport } from '@/hooks/accident/useRegisterReport';
import { generateCerfaPdf, downloadCerfaPdf } from '@/utils/generateCerfaPdf';
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
  const { isRegistering, registrationSuccess } = useRegisterReport();

  const generateCerfa = async (schemeImageDataUrl?: string | null): Promise<string> => {
    setIsGenerating(true);
    
    try {
      // Si aucune image n'est fournie, tenter de capturer le schéma
      if (!schemeImageDataUrl) {
        schemeImageDataUrl = await captureStageAsDataUrl();
      }
      
      // Génère le PDF avec les données du formulaire
      const url = await generateCerfaPdf(formData, schemeImageDataUrl);
      setPdfUrl(url);
      
      if (onSuccess) {
        onSuccess();
      }
      
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
      toast.info("Téléchargement du PDF en cours...");
      const result = await downloadCerfaPdf(url, 'constat-amiable.pdf');
      
      if (result) {
        toast.success("Le PDF a été téléchargé avec succès");
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors du téléchargement du CERFA:', error);
      toast.error("Impossible de télécharger le PDF");
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
