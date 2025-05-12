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

  return {
    isGenerating,
    isRegistering,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    handleGenerateCerfa,
    handleRegisterOfficial: async () => {
      if (!signatures?.partyA || !signatures?.partyB) {
        toast.error("Les deux signatures sont nécessaires pour l'enregistrement officiel");
        return;
      }
      
      setIsRegistering(true);
      try {
        // Prepare data for official registration - organizing it according to the expected parameters
        const reportData = {
          date: formData.date,
          time: formData.time,
          location: formData.location,
          personalEmail: formData.personalEmail,
          hasInjuries: formData.hasInjuries,
          injuriesDescription: formData.injuriesDescription,
          hasMaterialDamage: formData.hasMaterialDamage,
          materialDamageDescription: formData.materialDamageDescription
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

        // Compile all participant information
        const participants = {
          driverA: {
            name: formData.driverName,
            address: formData.driverAddress,
            phone: formData.driverPhone,
            license: formData.driverLicense
          },
          driverB: {
            name: formData.otherDriverName,
            address: formData.otherDriverAddress,
            phone: formData.otherDriverPhone,
            license: formData.otherDriverLicense
          },
          insuredA: {
            name: formData.insuredName,
            address: formData.insuredAddress,
            phone: formData.insuredPhone,
            email: formData.personalEmail
          },
          insuredB: {
            name: formData.otherInsuredName,
            address: formData.otherInsuredAddress,
            phone: formData.otherInsuredPhone,
            email: formData.otherInsuredEmail
          },
          witnesses: formData.witnesses || [],
          injuries: formData.injuries || []
        };

        const circumstances = {
          vehicleA: formData.vehicleACircumstances,
          vehicleB: formData.vehicleBCircumstances
        };

        const geolocation = {
          lat: formData.geolocation.lat,
          lng: formData.geolocation.lng,
          address: formData.geolocation.address
        };
        
        const signatureData = {
          partyA: signatures.partyA,
          partyB: signatures.partyB,
          timestamp: new Date().toISOString()
        };

        // Capture le schéma pour l'inclure dans le rapport officiel
        const schemeImageDataUrl = await captureSchemeImage();
        
        // Call the official registration function with the consolidated data structure
        const result = await registerOfficialReport(
          reportData, 
          vehicleA, 
          vehicleB, 
          circumstances, 
          geolocation,
          {
            participants,
            signatureData,
            // Utilisez le nom de propriété correct selon le type AdditionalData attendu
            signedSchemeImage: schemeImageDataUrl
          }
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
    },
    canRegisterOfficial: Boolean(signatures?.partyA && signatures?.partyB)
  };
};
