
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { downloadPDF } from "@/utils/downloadUtils";
import { FormData } from "./types";
import { generateCerfaPDF } from "@/utils/cerfaGeneration";

interface CerfaGenerationButtonProps {
  formData: FormData;
  className?: string;
}

const CerfaGenerationButton = ({ formData, className = "" }: CerfaGenerationButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCerfa = async () => {
    setIsGenerating(true);
    try {
      // Utilisation de la fonction de génération du CERFA avec les données du formulaire
      const pdfUrl = await generateCerfaPDF(formData);
      
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
