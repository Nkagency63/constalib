
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
      // Chercher le conteneur du schéma
      const schemeContainer = document.querySelector('.leaflet-container') as HTMLElement;
      
      if (!schemeContainer) {
        console.warn("Conteneur du schéma non trouvé");
        return null;
      }

      // Attendre que la carte soit complètement chargée
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capturer le schéma comme une image
      const canvas = await html2canvas(schemeContainer, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2, // Meilleure qualité
        logging: true, // Activer les logs pour déboguer
      });
      
      // Convertir le canvas en dataURL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error("Erreur lors de la capture du schéma:", error);
      return null;
    }
  };

  const handleGenerateCerfa = async () => {
    setIsGenerating(true);
    try {
      // Capturer le schéma comme une image
      console.log("Capture du schéma...");
      const schemeImageDataUrl = await captureSchemeImage();
      console.log("Schéma capturé:", schemeImageDataUrl ? "Oui" : "Non");
      
      // Utilisation de la fonction de génération du CERFA avec les données du formulaire et l'image du schéma
      console.log("Génération du PDF...");
      const pdfUrl = await generateCerfaPDF(formData, schemeImageDataUrl);
      
      // Téléchargement du PDF généré
      await downloadPDF(pdfUrl, "constat-amiable.pdf");
      toast.success("Téléchargement du constat amiable réussi");
    } catch (error: any) {
      console.error("Erreur lors de la génération du CERFA:", error);
      toast.error(error.message || "Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegisterOfficial = async () => {
    setIsRegistering(true);
    try {
      // Préparation des données pour l'enregistrement officiel
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

      // Appel de la fonction d'enregistrement officiel
      const result = await registerOfficialReport(reportData, vehicleA, vehicleB, circumstances, geolocation);
      
      if (result.success) {
        setReferenceId(result.referenceId);
        toast.success("Constat enregistré officiellement");
      } else {
        throw new Error(result.error || "Échec de l'enregistrement officiel");
      }
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement officiel:", error);
      toast.error(error.message || "Erreur lors de l'enregistrement officiel");
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
            <span>Génération en cours...</span>
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
            disabled={isGenerating || isRegistering}
          >
            {isRegistering ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Enregistrer officiellement</span>
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrement officiel du constat</DialogTitle>
            <DialogDescription>
              {referenceId ? (
                <div className="space-y-4 mt-4">
                  <p>Votre constat a été enregistré avec succès avec la référence :</p>
                  <p className="bg-green-50 border border-green-200 rounded-md p-3 text-center font-bold text-green-800">
                    {referenceId}
                  </p>
                  <p>
                    Cette référence est votre preuve d'enregistrement. Conservez-la précieusement et 
                    communiquez-la à votre assurance.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <p>
                    En cliquant sur "Enregistrer", vous allez déclarer officiellement ce constat 
                    dans le système e-constat.
                  </p>
                  <p>
                    Cette action aura une valeur juridique et remplacera le constat papier.
                    Un numéro de référence unique vous sera attribué.
                  </p>
                  <p className="font-semibold text-amber-600">
                    Assurez-vous que toutes les informations sont correctes avant de confirmer.
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
            
            {!referenceId && (
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
