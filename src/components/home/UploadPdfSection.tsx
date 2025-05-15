import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastAction,
} from "@/components/ui/toast"

interface UploadPdfSectionProps {
  // Define any props here
}

const UploadPdfSection: React.FC<UploadPdfSectionProps> = ({
  // List any props here
}) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Handle the file upload logic here
      console.log("File selected:", file.name);
      setFileUploaded(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-constalib-dark mb-4">
        Télécharger un constat amiable PDF
      </h2>
      <p className="text-constalib-dark-gray mb-6">
        Vous pouvez télécharger un constat amiable PDF pré-rempli pour faciliter
        la déclaration de votre accident.
      </p>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        className="flex items-center"
        onClick={handleFileUpload}
      >
        <FileUp className="mr-2 h-5 w-5" />
        Télécharger un fichier
      </Button>
      {fileUploaded ? (
        <Toast>
          <div className="flex">
            <div className="flex-1">
              <ToastTitle>Fichier téléchargé avec succès</ToastTitle>
              <ToastDescription>
                Votre fichier a été téléchargé et est en cours de traitement.
              </ToastDescription>
            </div>
            <ToastClose />
          </div>
          <ToastAction asChild altText="Try again">
            <Button variant="default" size="sm">Continuer</Button>
          </ToastAction>
        </Toast>
      ) : null}
    </div>
  );
};

export default UploadPdfSection;
