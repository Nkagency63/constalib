
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

interface DownloadButtonProps {
  onClick: () => Promise<void>;
  isGenerating: boolean;
  className?: string;
}

const DownloadButton = ({ onClick, isGenerating, className = "" }: DownloadButtonProps) => {
  const handleDownloadClick = async () => {
    try {
      await onClick();
    } catch (error) {
      console.error("Error in download button handler:", error);
      toast.error("Une erreur est survenue lors de la génération du PDF");
    }
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 flex-grow ${className}`}
      onClick={handleDownloadClick}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full border-blue-600" />
          <span>Génération PDF...</span>
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

export default DownloadButton;
