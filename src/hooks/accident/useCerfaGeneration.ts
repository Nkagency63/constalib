
import { useState } from 'react';
import { toast } from "sonner";
import { FormData } from "@/components/accident/types";
import { generatePDF } from "@/utils/pdfGeneratorUtils";
import { captureStageAsDataUrl } from "@/components/accident/scheme/SchemeExport";

interface UseCerfaGenerationProps {
  formData: FormData;
  onSuccess?: () => void;
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  };
}

export const useCerfaGeneration = ({ formData, signatures, onSuccess }: UseCerfaGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const captureSchemeImage = async (): Promise<string | null> => {
    try {
      toast.info("Capture du schéma d'accident en cours...", { duration: 2000 });
      
      // Attendre un instant pour s'assurer que le DOM est prêt
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Utiliser la fonction dédiée pour capturer le schéma
      const imageDataUrl = await captureStageAsDataUrl();
      
      if (imageDataUrl) {
        toast.success("Schéma capturé avec succès", { duration: 2000 });
        return imageDataUrl;
      } else {
        toast.warning("Impossible de capturer le schéma, l'export PDF continuera sans schéma");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la capture du schéma:", error);
      toast.error("Impossible de capturer le schéma de l'accident");
      return null;
    }
  };

  // Fonction pour générer le PDF et retourner un Blob
  const generatePdf = async (): Promise<Blob | null> => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      // Capture du schéma
      toast.info("Préparation du document PDF...", { duration: 3000 });
      
      console.log("Capture du schéma en cours...");
      const schemeImageDataUrl = await captureSchemeImage();
      console.log("Schéma capturé:", schemeImageDataUrl ? "Oui" : "Non");
      
      // Ajout des signatures
      console.log("Signatures:", signatures);
      const signatureA = signatures?.partyA || null;
      
      // Générer le PDF avec le schéma et la signature
      const pdfUrl = await generatePDF(formData, schemeImageDataUrl);
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast.success("PDF généré avec succès");
      
      // Create a Blob from the response
      if (typeof pdfUrl === 'string') {
        // Convert base64 or data URL to Blob
        try {
          const base64Response = await fetch(pdfUrl);
          return await base64Response.blob();
        } catch (error) {
          console.error("Erreur lors de la conversion en Blob:", error);
          return null;
        }
      }
      
      return null;
    } catch (error: any) {
      console.error("Erreur de génération du PDF:", error);
      const message = error?.message || "Erreur de génération du PDF";
      setErrorMessage(message);
      toast.error(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    errorMessage,
    generatePdf
  };
};

export default useCerfaGeneration;
