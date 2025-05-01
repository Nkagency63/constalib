
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { downloadPDF } from "@/utils/downloadUtils";
import { FormData } from "./types";
import { generateCerfaPDF } from "@/utils/cerfa";
import html2canvas from "html2canvas";

interface CerfaGenerationButtonProps {
  formData: FormData;
  className?: string;
}

const CerfaGenerationButton = ({ formData, className = "" }: CerfaGenerationButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const captureSchemeImage = async (): Promise<string | null> => {
    try {
      // Chercher le conteneur du schéma
      const schemeContainer = document.querySelector('.leaflet-container') as HTMLElement;
      
      if (!schemeContainer) {
        console.warn("Conteneur du schéma non trouvé");
        return null;
      }

      // Capturer le schéma comme une image
      const canvas = await html2canvas(schemeContainer, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2, // Meilleure qualité
      });
      
      // Convertir le canvas en dataURL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error("Erreur lors de la capture du schéma:", error);
      return null;
    }
  };

  const handleGenerateCerfa = async () => {
    setIsGenerating(true);
    try {
      // Capturer le schéma comme une image
      const schemeImageDataUrl = await captureSchemeImage();
      
      // Utilisation de la fonction de génération du CERFA avec les données du formulaire et l'image du schéma
      const pdfUrl = await generateCerfaPDF(formData, schemeImageDataUrl);
      
      // Téléchargement du PDF généré
      await downloadPDF(pdfUrl, "constat-amiable.pdf");
      toast.success("Téléchargement du constat amiable réussi");
    } catch (error: any) {
      console.error("Erreur lors de la génération du CERFA:", error);
      toast.error(error.message || "Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      onClick={handleGenerateCerfa}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full border-blue-600" />
          <span>Génération en cours...</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>Télécharger le CERFA</span>
        </>
      )}
    </Button>
  );
};

export default CerfaGenerationButton;
