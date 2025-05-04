
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
}

const CerfaGenerationButton = ({ formData, className = "" }: CerfaGenerationButtonProps) => {
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
      const pdfUrl = await generateCerfaPDF(formData, schemeImageDataUrl);
      
      // Download the generated PDF
      await downloadPDF(pdfUrl, "constat-amiable.pdf");
      toast.success("Your accident report PDF has been downloaded");
    } catch (error: any) {
      console.error("Error generating CERFA:", error);
      toast.error(error.message || "Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegisterOfficial = async () => {
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

      // Call the official registration function
      const result = await registerOfficialReport(reportData, vehicleA, vehicleB, circumstances, geolocation);
      
      if (result.success) {
        setReferenceId(result.referenceId);
        toast.success("Official report registered successfully");
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
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Download CERFA</span>
          </>
        )}
      </Button>

      <Dialog open={showOfficialDialog} onOpenChange={setShowOfficialDialog}>
        <DialogTrigger asChild>
          <Button
            className="flex items-center gap-2 flex-grow"
            disabled={isGenerating || isRegistering}
          >
            {isRegistering ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Register Officially</span>
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Official Accident Report Registration</DialogTitle>
            <DialogDescription>
              {referenceId ? (
                <div className="space-y-4 mt-4">
                  <p>Your report has been successfully registered with reference:</p>
                  <p className="bg-green-50 border border-green-200 rounded-md p-3 text-center font-bold text-green-800">
                    {referenceId}
                  </p>
                  <p>
                    This reference is your proof of registration. Keep it safe and 
                    provide it to your insurance company.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <p>
                    By clicking "Register", you will officially declare this accident report 
                    in the e-constat system.
                  </p>
                  <p>
                    This action has legal value and will replace the paper accident report.
                    A unique reference number will be assigned to you.
                  </p>
                  <p className="font-semibold text-amber-600">
                    Please make sure all information is correct before confirming.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline">
                {referenceId ? "Close" : "Cancel"}
              </Button>
            </DialogClose>
            
            {!referenceId && (
              <Button 
                onClick={handleRegisterOfficial} 
                disabled={isRegistering}
              >
                {isRegistering ? "Registering..." : "Register"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CerfaGenerationButton;
