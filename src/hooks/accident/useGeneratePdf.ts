
import { useState } from 'react';
import { toast } from "sonner";
import { FormData } from "@/components/accident/types";
import { generateCerfaPDF } from "@/utils/cerfa";
import { downloadPDF } from "@/utils/downloadUtils";
import { captureSchemeAsDataUrl } from "@/components/accident/scheme/SchemeExport";

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
      const imageDataUrl = await captureSchemeAsDataUrl();
      
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
      
      // Préparer les données complètes pour le CERFA
      const completeFormData: FormData = {
        ...formData,
        vehicleLabels: {
          A: {
            brand: formData.vehicleBrand,
            model: formData.vehicleModel,
            licensePlate: formData.licensePlate
          },
          B: {
            brand: formData.otherVehicle.brand,
            model: formData.otherVehicle.model,
            licensePlate: formData.otherVehicle.licensePlate
          }
        },
        // S'assurer que toutes les informations conducteur/assuré sont présentes
        driverInfo: {
          A: {
            name: formData.driverName || formData.insuredName || "Non renseigné",
            address: formData.driverAddress || formData.insuredAddress || "Non renseigné",
            licenseNumber: formData.driverLicense || "Non renseigné",
            phone: formData.driverPhone || formData.insuredPhone || "Non renseigné",
          },
          B: {
            name: formData.otherDriverName || "Non renseigné",
            address: formData.otherDriverAddress || "Non renseigné",
            licenseNumber: formData.otherDriverLicense || "Non renseigné",
            phone: formData.otherDriverPhone || "Non renseigné",
          }
        },
        insuredInfo: {
          A: {
            name: formData.insuredName || "Non renseigné",
            address: formData.insuredAddress || "Non renseigné",
            phone: formData.insuredPhone || "Non renseigné",
            email: formData.personalEmail || "Non renseigné",
          },
          B: {
            name: formData.otherInsuredName || "Non renseigné",
            address: formData.otherInsuredAddress || "Non renseigné",
            phone: formData.otherInsuredPhone || "Non renseigné",
            email: formData.otherInsuredEmail || "Non renseigné",
          }
        },
        // Informations sur les blessures
        injuriesDescription: formData.injuriesDescription || "",
        hasInjuries: formData.hasInjuries || false,
        injuries: formData.injuries || [],
        // Informations sur les dégâts matériels
        hasMaterialDamage: formData.hasMaterialDamage || false,
        materialDamageDescription: formData.materialDamageDescription || ""
      };
      
      // Generate the CERFA PDF with complete form data and scheme image
      console.log("Génération du PDF avec les données:", completeFormData.date, completeFormData.time);
      const pdfUrl = await generateCerfaPDF(completeFormData, schemeImageDataUrl, signatures);
      
      // Download the generated PDF
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
