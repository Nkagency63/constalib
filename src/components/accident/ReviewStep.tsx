
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { generatePDF } from '@/utils/pdfGeneratorUtils';
import VehicleScheme from '@/components/VehicleScheme';
import { useRegisterReport, RegisterReportResult } from '@/hooks/accident/useRegisterReport';
import { captureStageAsDataUrl } from './scheme/SchemeExport';
import usePdfGenerator from '@/hooks/accident/usePdfGenerator';
import { SchemeData } from './types/vehicleTypes';

interface ReviewStepProps {
  formData: any;
  onSubmitSuccess: () => void;
}

const ReviewStep = ({ formData, onSubmitSuccess }: ReviewStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [officialSubmission, setOfficialSubmission] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [schemeData, setSchemeData] = useState<SchemeData | null>(formData.schemeData);
  
  const {
    isRegistering,
    registrationSuccess,
    registrationError,
    reportId,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    setReferenceId,
    registerReport
  } = useRegisterReport();
  
  const { generateAndDownloadPdf, isGenerating } = usePdfGenerator();

  const captureScheme = async (): Promise<string | null> => {
    try {
      const schemeContainer = document.querySelector('.scheme-container');
      if (!schemeContainer) {
        return null;
      }
      
      // Méthode Konva
      const stageElement = schemeContainer.querySelector('canvas');
      if (stageElement) {
        return stageElement.toDataURL();
      }
      
      return null;
    } catch (error) {
      console.error('Error capturing scheme:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Capture the scheme image if available
      let schemeImageDataUrl = null;
      try {
        schemeImageDataUrl = await captureScheme();
      } catch (error) {
        console.error('Error capturing scheme:', error);
        // Continue without scheme image if capture fails
      }
      
      // Prepare form data with scheme image
      const dataToSubmit = {
        ...formData,
        schemeImageDataUrl
      };
      
      // Register the report
      const success = await registerReport(dataToSubmit);
      
      if (success) {
        setSubmissionSuccess(true);
        onSubmitSuccess();
      } else {
        throw new Error(registrationError || 'Erreur lors de l\'enregistrement du constat');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmissionError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
      toast.error(`Erreur: ${submissionError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      // Capture the scheme image if available
      let schemeImageDataUrl = null;
      try {
        schemeImageDataUrl = await captureScheme();
      } catch (error) {
        console.error('Error capturing scheme:', error);
      }
      
      // Generate PDF and download
      await generateAndDownloadPdf(formData, schemeImageDataUrl);
      toast.success("Le PDF a été généré et téléchargé avec succès");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error("Impossible de générer le PDF. Veuillez réessayer.");
    }
  };

  const handleOfficialSubmission = () => {
    setOfficialSubmission(true);
    setShowOfficialDialog(true);
  };

  const handleUpdateScheme = (newSchemeData: SchemeData) => {
    setSchemeData(newSchemeData);
  };

  return (
    <div className="space-y-8">
      <div className="bg-constalib-light-blue p-4 rounded-lg flex items-start space-x-3">
        <AlertTriangle className="text-constalib-blue flex-shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-constalib-blue font-medium">Vérifiez vos informations</h4>
          <p className="text-sm text-constalib-dark-gray">
            Avant de soumettre votre constat amiable, assurez-vous que toutes les informations sont exactes et complètes.
          </p>
        </div>
      </div>
      
      {/* Summary sections for the review step */}
      
      {/* Vehicle Scheme */}
      <div className="mt-8 border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-medium mb-4">Schéma de l'accident</h3>
        <VehicleScheme 
          initialData={schemeData} 
          onSchemeUpdate={handleUpdateScheme}
        />
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Génération en cours..." : "Télécharger le PDF"}
        </Button>
        
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={handleOfficialSubmission}
            disabled={isSubmitting || officialSubmission}
            className="flex items-center"
          >
            <Send className="mr-2 h-4 w-4" />
            Enregistrement officiel
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isSubmitting ? "Traitement..." : "Enregistrer mon constat"}
          </Button>
        </div>
      </div>
      
      {submissionError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <p className="font-medium">Erreur lors de la soumission</p>
          <p className="text-sm">{submissionError}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
