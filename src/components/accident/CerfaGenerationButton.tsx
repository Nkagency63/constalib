
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { downloadPDF } from "@/utils/downloadUtils";
import { FormData } from "./types";

interface CerfaGenerationButtonProps {
  formData: FormData;
  className?: string;
}

const CerfaGenerationButton = ({ formData, className = "" }: CerfaGenerationButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCerfa = async () => {
    setIsGenerating(true);
    try {
      // Pour l'instant, on télécharge simplement le fichier PDF vierge
      await downloadPDF("/pdf/constat-amiable-vierge.pdf", "constat-amiable.pdf");
      toast.success("Téléchargement du constat amiable au format CERFA réussi");
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
