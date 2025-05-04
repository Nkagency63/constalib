
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { downloadPDF } from "@/utils/downloadUtils";
import { FormData } from "./types";
import { generateCerfaPDF } from "@/utils/cerfa";
import html2canvas from "html2canvas";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { registerOfficialReport } from "@/services/accidentReportService";

interface CerfaGenerationButtonProps {
  formData: FormData;
  className?: string;
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  };
}

const CerfaGenerationButton = ({ formData, className = "", signatures }: CerfaGenerationButtonProps) => {
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
      
      // Try to download using the Supabase storage path
      const supabasePath = "storage:constat-amiable-officiel.pdf/constat-amiable-officiel.pdf";
      toast.info("Checking for official PDF in Supabase storage...");
      
      try {
        await downloadPDF(supabasePath, "constat-amiable.pdf");
      } catch (storageError) {
        console.error("Error downloading from Supabase:", storageError);
        // Fallback to the generated PDF if Supabase download fails
        await downloadPDF(pdfUrl, "constat-amiable.pdf");
      }
      
      toast.success("Your accident report PDF has been downloaded");
      
      // Set referenceId if signatures were provided (official document)
      if (signatures?.partyA && signatures?.partyB) {
        setReferenceId("CR-" + pdfUrl.split("/").pop()?.split(".")[0]);
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

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button
        variant="outline"
        className={`flex items-center gap-2 flex-grow ${className}`}
        onClick={handleGenerateCerfa}
        disabled={isGenerating || isRegistering}
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

      <Dialog open={showOfficialDialog} onOpenChange={setShowOfficialDialog}>
        <DialogTrigger asChild>
          <Button
            className="flex items-center gap-2 flex-grow"
            disabled={isGenerating || isRegistering || !canRegisterOfficial}
            onClick={canRegisterOfficial ? handleRegisterOfficial : undefined}
          >
            {isRegistering ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Enregistrer Officiellement</span>
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrement Officiel du Constat</DialogTitle>
            <DialogDescription>
              {referenceId ? (
                <div className="space-y-4 mt-4">
                  <p>Votre constat a été enregistré avec succès sous la référence :</p>
                  <p className="bg-green-50 border border-green-200 rounded-md p-3 text-center font-bold text-green-800">
                    {referenceId}
                  </p>
                  <p>
                    Cette référence est votre preuve d'enregistrement. Conservez-la précieusement
                    et communiquez-la à votre assurance.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <p>
                    En cliquant sur "Enregistrer", vous déclarerez officiellement ce constat
                    dans le système e-constat.
                  </p>
                  <p>
                    Cette action a une valeur juridique et remplacera le constat papier.
                    Un numéro de référence unique vous sera attribué.
                  </p>
                  <p className="font-semibold text-amber-600">
                    Veuillez vérifier que toutes les informations sont correctes avant de confirmer.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline">
                {referenceId ? "Fermer" : "Annuler"}
              </Button>
            </DialogClose>
            
            {!referenceId && canRegisterOfficial && (
              <Button 
                onClick={handleRegisterOfficial} 
                disabled={isRegistering}
              >
                {isRegistering ? "Enregistrement..." : "Enregistrer"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CerfaGenerationButton;
