import { useState } from 'react';
import { toast } from "sonner";
import { FormData } from "@/components/accident/types";
import { generateCerfaPDF } from "@/utils/cerfa";
import { downloadPDF } from "@/utils/downloadUtils";
import { registerOfficialReport } from "@/services/accidentReportService";
import { captureSchemeAsDataUrl } from "@/components/accident/scheme/SchemeExport";

interface UseCerfaGenerationProps {
  formData: FormData;
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  };
}

export const useCerfaGeneration = ({ formData, signatures }: UseCerfaGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const captureSchemeImage = async (): Promise<string | null> => {
    try {
      toast.info("Capture du schéma d'accident en cours...", { duration: 2000 });
      
      // Utiliser la fonction dédiée pour capturer le schéma
      const imageDataUrl = await captureSchemeAsDataUrl();
      
      if (imageDataUrl) {
        toast.success("Schéma capturé avec succès", { duration: 2000 });
      }
      
      return imageDataUrl;
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
      
      // Préparer les données supplémentaires pour le CERFA
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
        // Ajouter les données pour les sections manquantes
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
        // Fix type compatibility issue with injuries
        injuriesDescription: formData.injuriesDescription || "",
        hasInjuries: formData.hasInjuries || false,
        injuries: formData.injuries || [],
        // Material damage information
        hasMaterialDamage: formData.hasMaterialDamage || false,
        materialDamageDescription: formData.materialDamageDescription || ""
      };
      
      // Generate the CERFA PDF with complete form data and scheme image
      console.log("Génération du PDF avec les données:", completeFormData.date, completeFormData.time);
      const pdfUrl = await generateCerfaPDF(completeFormData, schemeImageDataUrl, signatures);
      
      // Download the generated PDF
      await downloadPDF(pdfUrl, "constat-amiable.pdf");
      toast.success("Votre constat amiable PDF a été téléchargé");
      
      // Set referenceId if signatures were provided (official document)
      if (signatures?.partyA && signatures?.partyB) {
        setReferenceId("CR-" + Math.random().toString(36).substring(2, 9));
      }
    } catch (error: any) {
      console.error("Erreur de génération du CERFA:", error);
      toast.error(error.message || "Erreur de génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegisterOfficial = async () => {
    if (!signatures?.partyA || !signatures?.partyB) {
      toast.error("Les deux signatures sont nécessaires pour l'enregistrement officiel");
      return;
    }
    
    setIsRegistering(true);
    try {
      // Prepare data for official registration
      const reportData = {
        date: formData.date,
        time: formData.time,
        location: formData.location,
        personalEmail: formData.personalEmail
      };

      const vehicleA = {
        licensePlate: formData.licensePlate,
        brand: formData.vehicleBrand,
        model: formData.vehicleModel,
        insuranceCompany: formData.insuranceCompany,
        insurancePolicy: formData.insurancePolicy
      };

      const vehicleB = {
        licensePlate: formData.otherVehicle.licensePlate,
        brand: formData.otherVehicle.brand,
        model: formData.otherVehicle.model,
        insuranceCompany: formData.otherVehicle.insuranceCompany,
        insurancePolicy: formData.otherVehicle.insurancePolicy
      };

      const circumstances = {
        vehicleA: formData.vehicleACircumstences,
        vehicleB: formData.vehicleBCircumstences
      };

      const geolocation = {
        lat: formData.geolocation.lat,
        lng: formData.geolocation.lng,
        address: formData.geolocation.address
      };
      
      // Include signatures in the registration data
      const signatureData = {
        partyA: signatures.partyA,
        partyB: signatures.partyB,
        timestamp: new Date().toISOString()
      };

      // Call the official registration function
      const result = await registerOfficialReport(
        reportData, 
        vehicleA, 
        vehicleB, 
        circumstances, 
        geolocation,
        signatureData
      );
      
      if (result.success) {
        setReferenceId(result.referenceId);
        setShowOfficialDialog(true);
        toast.success("Constat enregistré officiellement");
      } else {
        throw new Error(result.error || "Failed to register official report");
      }
    } catch (error: any) {
      console.error("Error registering official report:", error);
      toast.error(error.message || "Error registering official report");
    } finally {
      setIsRegistering(false);
    }
  };

  // Determine if the official register button should be enabled
  const canRegisterOfficial = Boolean(signatures?.partyA && signatures?.partyB);

  return {
    isGenerating,
    isRegistering,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    handleGenerateCerfa,
    handleRegisterOfficial,
    canRegisterOfficial
  };
};
