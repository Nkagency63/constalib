
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { FormData } from './types';
import { useCerfaGeneration } from '@/hooks/accident/useCerfaGeneration';

interface CerfaGenerationButtonProps {
  formData: FormData;
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  };
  className?: string;
}

const CerfaGenerationButton: React.FC<CerfaGenerationButtonProps> = ({ 
  formData, 
  signatures,
  className = ""
}) => {
  const { isGenerating, downloadCerfa } = useCerfaGeneration({ 
    formData,
    onSuccess: () => toast.success("PDF généré avec succès"),
    onError: (error) => toast.error(`Erreur: ${error.message}`)
  });

  const handleClick = async () => {
    try {
      toast.info("Préparation du constat CERFA...");
      await downloadCerfa();
    } catch (error) {
      console.error("Erreur lors de la génération du CERFA:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isGenerating}
      className={`${className} flex items-center`}
      variant="outline"
    >
      <FileText className="mr-2 h-4 w-4" />
      {isGenerating ? "Génération en cours..." : "Télécharger le constat CERFA"}
    </Button>
  );
};

export default CerfaGenerationButton;
