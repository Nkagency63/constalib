
import { useState } from 'react';
import { toast } from "sonner";
import { FormData } from "@/components/accident/types";
import { generatePDF, downloadPDF } from "@/utils/pdfGeneratorUtils";
import { captureStageAsDataUrl } from "@/components/accident/scheme/SchemeExport";

interface UseGeneratePdfProps {
  formData: FormData;
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  };
}

export const useGeneratePdf = ({ formData, signatures }: UseGeneratePdfProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateCerfa = async () => {
    setIsGenerating(true);
    try {
      // Capture the scheme as an image
      toast.info("Préparation du document PDF...", { duration: 3000 });
      
      console.log("Capture du schéma en cours...");
      const schemeImageDataUrl = await captureSchemeImage();
      console.log("Schéma capturé:", schemeImageDataUrl ? "Oui" : "Non");
      
      // Générer le PDF avec les données du formulaire et l'image du schéma
      const pdfUrl = await generatePDF(formData, schemeImageDataUrl);
      
      // Télécharger le PDF généré
      await downloadPDF(pdfUrl, "constat-amiable.pdf");
      toast.success("Votre constat amiable PDF a été téléchargé");
      
      return { pdfUrl, schemeImageDataUrl };
    } catch (error: any) {
      console.error("Erreur de génération du CERFA:", error);
      toast.error(error.message || "Erreur de génération du PDF");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handleGenerateCerfa
  };
};
