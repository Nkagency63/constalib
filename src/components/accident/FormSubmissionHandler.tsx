
import { useState } from 'react';
import { FormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { saveVehicleData, uploadPhotos, saveAccidentReport, sendEmails } from '@/services/accidentReportService';

interface FormSubmissionHandlerProps {
  formData: FormData;
  children: (props: {
    handleSubmit: (e: React.FormEvent) => Promise<void>;
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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          toast({
            title: "Emails envoyés",
            description: "Le constat a été envoyé par email aux destinataires spécifiés.",
            variant: "default"
          });
        } catch (emailError: any) {
          console.error("Error sending emails:", emailError);
          toast({
            title: "Alerte",
            description: `La déclaration a été enregistrée mais l'envoi des emails a échoué: ${emailError.message}`,
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Succès",
        description: "Votre déclaration a été envoyée avec succès.",
        variant: "default"
      });
      sonnerToast.success("Votre déclaration a été envoyée avec succès.");
      onSubmitSuccess();
    } catch (err: any) {
      console.error('Error in submission process:', err);
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la soumission de votre déclaration.",
        variant: "destructive"
      });
      sonnerToast.error("Une erreur est survenue lors de la soumission de votre déclaration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>{children({ handleSubmit, isSubmitting })}</>
  );
};

export default FormSubmissionHandler;
