
import { useState } from 'react';
import { toast } from "sonner";
import { FormData } from "@/components/accident/types";
import { generateCerfaPDF } from "@/utils/cerfa";
import { downloadPDF } from "@/utils/downloadUtils";
import { registerOfficialReport } from "@/services/accidentReportService";
import html2canvas from "html2canvas";

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
      // Find the scheme container
      const schemeContainer = document.querySelector('.leaflet-container') as HTMLElement;
      
      if (!schemeContainer) {
        console.warn("Scheme container not found");
        return null;
      }

      toast.info("Capturing accident scheme...", { duration: 2000 });

      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture the scheme as an image
      const canvas = await html2canvas(schemeContainer, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2, // Better quality
        logging: false,
      });
      
      // Convert canvas to dataURL
      const imageDataUrl = canvas.toDataURL('image/png');
      
      if (imageDataUrl) {
        toast.success("Scheme captured successfully", { duration: 2000 });
      }
      
      return imageDataUrl;
    } catch (error) {
      console.error("Error capturing scheme:", error);
      toast.error("Could not capture the accident scheme");
      return null;
    }
  };

  const handleGenerateCerfa = async () => {
    setIsGenerating(true);
    try {
      // Capture the scheme as an image
      toast.info("Preparing PDF document...", { duration: 3000 });
      
      console.log("Capturing scheme...");
      const schemeImageDataUrl = await captureSchemeImage();
      console.log("Scheme captured:", schemeImageDataUrl ? "Yes" : "No");
      
      // Generate the CERFA PDF with form data and scheme image
      console.log("Generating PDF with form data:", formData.date, formData.time);
      const pdfUrl = await generateCerfaPDF(formData, schemeImageDataUrl, signatures);
      
      // Download the generated PDF
      await downloadPDF(pdfUrl, "constat-amiable.pdf");
      toast.success("Your accident report PDF has been downloaded");
      
      // Set referenceId if signatures were provided (official document)
      if (signatures?.partyA && signatures?.partyB) {
        setReferenceId("CR-" + Math.random().toString(36).substring(2, 9));
      }
    } catch (error: any) {
      console.error("Error generating CERFA:", error);
      toast.error(error.message || "Error generating PDF");
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
        vehicleA: formData.vehicleACircumstances,
        vehicleB: formData.vehicleBCircumstances
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
