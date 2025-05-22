
import { useState } from 'react';
import { FormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { saveVehicleData, uploadPhotos, saveAccidentReport, sendEmails } from '@/services/accidentReportService';
import AccidentReportSubmitButton from './AccidentReportSubmitButton';

interface FormSubmissionHandlerProps {
  formData: FormData;
  children?: (props: {
    handleSubmit: (e?: React.FormEvent) => Promise<void>;  // Make the event parameter optional
    isSubmitting: boolean;
  }) => React.ReactNode;
  onSubmitSuccess: () => void;
}

const FormSubmissionHandler = ({ 
  formData, 
  children, 
  onSubmitSuccess 
}: FormSubmissionHandlerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: uiToast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {  // Make the event parameter optional
    if (e) e.preventDefault();  // Only call preventDefault if e exists
    setIsSubmitting(true);
    
    try {
      const vehicleId = await saveVehicleData({
        license_plate: formData.licensePlate,
        brand: formData.vehicleBrand,
        model: formData.vehicleModel,
        year: formData.vehicleYear,
        first_registration: formData.firstRegistration,
        insurance_policy: formData.insurancePolicy,
        insurance_company: formData.insuranceCompany
      });
      
      const otherVehicleId = await saveVehicleData({
        license_plate: formData.otherVehicle.licensePlate,
        brand: formData.otherVehicle.brand,
        model: formData.otherVehicle.model,
        year: formData.otherVehicle.year,
        first_registration: formData.otherVehicle.firstRegistration,
        insurance_policy: formData.otherVehicle.insurancePolicy,
        insurance_company: formData.otherVehicle.insuranceCompany
      });
      
      const vehiclePhotoUrls = await uploadPhotos(formData.vehiclePhotos, 'vehicle');
      const damagePhotoUrls = await uploadPhotos(formData.damagePhotos, 'damage');
      
      const data = await saveAccidentReport(
        formData,
        vehicleId,
        otherVehicleId,
        vehiclePhotoUrls,
        damagePhotoUrls
      );
      
      console.log('Accident report saved:', data);
      
      if (data && data[0] && (formData.personalEmail || formData.insuranceEmails.length > 0 || formData.involvedPartyEmails.length > 0)) {
        try {
          await sendEmails(data[0].id, formData);
          uiToast({
            title: "Emails envoyés",
            description: "Le constat a été envoyé par email aux destinataires spécifiés.",
            variant: "default"
          });
        } catch (emailError: any) {
          console.error("Error sending emails:", emailError);
          uiToast({
            title: "Alerte",
            description: `La déclaration a été enregistrée mais l'envoi des emails a échoué: ${emailError.message}`,
            variant: "destructive"
          });
        }
      }
      
      uiToast({
        title: "Succès",
        description: "Votre déclaration a été envoyée avec succès.",
        variant: "default"
      });
      toast.success("Votre déclaration a été envoyée avec succès.");
      onSubmitSuccess();
    } catch (err: any) {
      console.error('Error in submission process:', err);
      uiToast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la soumission de votre déclaration.",
        variant: "destructive"
      });
      toast.error("Une erreur est survenue lors de la soumission de votre déclaration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If children prop is provided, use it for custom rendering
  if (children) {
    return <>{children({ handleSubmit, isSubmitting })}</>;
  }

  // Default submit button
  return (
    <AccidentReportSubmitButton
      formData={formData}
      submitReport={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default FormSubmissionHandler;
