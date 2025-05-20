
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCerfaGeneration } from "@/hooks/accident/useCerfaGeneration";
import { useState } from "react";

interface CerfaGenerationButtonProps {
  formData: any;
  className?: string;
  onSuccess?: () => void;
  text?: string;
}

const CerfaGenerationButton = ({ 
  formData, 
  className = "", 
  onSuccess, 
  text = "Télécharger le PDF" 
}: CerfaGenerationButtonProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { 
    generatePdf, 
    isGenerating,
    errorMessage 
  } = useCerfaGeneration({ 
    formData,
    onSuccess
  });

  const handleGeneratePdf = async () => {
    try {
      const blob = await generatePdf();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        
        // Create a download link for the PDF and click it
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `Constat_Amiable_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  return (
    <Button 
      onClick={handleGeneratePdf}
      disabled={isGenerating}
      className={className}
      variant="outline"
    >
      <Download className="w-4 h-4 mr-2" />
      {isGenerating ? "Génération en cours..." : text}
    </Button>
  );
};

export default CerfaGenerationButton;
