import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormData } from "@/components/accident/types";
import { generateCerfaPDF } from "@/utils/cerfa";
import { downloadPDF, uploadFileToStorage } from "@/utils/downloadUtils";

interface FormSubmissionHandlerProps {
  formData: FormData;
  onSubmitSuccess: () => void;
}

const FormSubmissionHandler: React.FC<FormSubmissionHandlerProps> = ({ formData, onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handlePhotoUpload = async (formData: FormData) => {
    const uploadPromises = [];
    let vehiclePhotoUrls: string[] = [];
    let damagePhotoUrls: string[] = [];

    // Only proceed if there are photos to upload
    if (formData.vehiclePhotos && formData.vehiclePhotos.length > 0) {
      for (const photo of formData.vehiclePhotos) {
        if (photo instanceof File) { // Check if it's a File object
          const filePath = `accidents/${Date.now()}-${photo.name}`;
          uploadPromises.push(
            uploadFileToStorage(photo, filePath).then(url => {
              vehiclePhotoUrls.push(url);
            })
          );
        } else if (typeof photo === 'string') {
          // It's already a URL, just add it
          vehiclePhotoUrls.push(photo);
        }
      }
    }

    if (formData.damagePhotos && formData.damagePhotos.length > 0) {
      for (const photo of formData.damagePhotos) {
        if (photo instanceof File) { // Check if it's a File object
          const filePath = `accidents/${Date.now()}-${photo.name}`;
          uploadPromises.push(
            uploadFileToStorage(photo, filePath).then(url => {
              damagePhotoUrls.push(url);
            })
          );
        } else if (typeof photo === 'string') {
          // It's already a URL, just add it
          damagePhotoUrls.push(photo);
        }
      }
    }

    // Wait for all uploads to complete if there are any
    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
    }

    return { vehiclePhotoUrls, damagePhotoUrls };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Upload photos and get URLs
      const { vehiclePhotoUrls, damagePhotoUrls } = await handlePhotoUpload(formData);

      // Prepare the data to be sent to the backend
      const submissionData = {
        ...formData,
        vehiclePhotos: vehiclePhotoUrls,
        damagePhotos: damagePhotoUrls,
      };

      // Simulate sending data to backend
      console.log("Submitting data:", submissionData);
      toast.success("Constat soumis avec succès!");

      // Generate and download the CERFA PDF
      const pdfUrl = await generateCerfaPDF(formData);
      setPdfUrl(pdfUrl);
      await downloadPDF(pdfUrl, "constat-amiable.pdf");

      // Call the success callback
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Erreur lors de la soumission du constat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-end">
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Envoi en cours..." : "Soumettre le constat"}
      </Button>
    </div>
  );
};

export default FormSubmissionHandler;
