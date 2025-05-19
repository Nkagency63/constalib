
import { useState } from 'react';
import { saveAccidentReport } from '@/services/accidentReportService';
import { toast } from 'sonner';
import { uploadFileToStorage } from '@/utils/downloadUtils';

export interface RegisterReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
}

export const useRegisterReport = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const registerReport = async (formData: any): Promise<boolean> => {
    setIsRegistering(true);
    setRegistrationError(null);
    
    try {
      // Upload any scheme image if available
      let schemeImageUrl = null;
      if (formData.schemeData && formData.schemeImageDataUrl) {
        try {
          // Convert data URL to blob for upload
          const response = await fetch(formData.schemeImageDataUrl);
          const blob = await response.blob();
          const file = new File([blob], `scheme-${Date.now()}.png`, { type: 'image/png' });
          
          // Upload the scheme image
          schemeImageUrl = await uploadFileToStorage(
            file, 
            `accident-reports/${formData.userId || 'anonymous'}/schemes`
          );
          console.log('Scheme image uploaded:', schemeImageUrl);
        } catch (error) {
          console.error('Error uploading scheme image:', error);
          // Continue with report submission even if image upload fails
        }
      }
      
      // Map form data to the expected API structure
      const apiData = {
        userId: formData.userId || 'anonymous',
        date: formData.date,
        time: formData.time,
        location: formData.location,
        city: formData.city || '',
        country: formData.country || 'France',
        hasInjuries: formData.hasInjuries,
        injuriesDescription: formData.injuriesDescription,
        hasWitnesses: formData.hasWitnesses,
        witnesses: formData.witnesses,
        vehicleA: {
          licensePlate: formData.licensePlate,
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year: formData.vehicleYear,
          description: formData.vehicleDescription,
          insuranceInfo: {
            company: formData.insuranceCompany,
            policy: formData.insurancePolicy
          },
          driverName: formData.driver?.name || '',
          driverPhone: formData.driver?.phone || '',
          driverAddress: formData.driver?.address || '',
          driverLicense: formData.driver?.licenseNumber || '',
          insuredName: formData.insured?.name || '',
          insuredPhone: formData.insured?.phone || '',
          insuredAddress: formData.insured?.address || ''
        },
        vehicleB: {
          licensePlate: formData.otherVehicle?.licensePlate || '',
          brand: formData.otherVehicle?.brand || '',
          model: formData.otherVehicle?.model || '',
          year: formData.otherVehicle?.year || '',
          description: formData.otherVehicle?.description || '',
          insuranceInfo: {
            company: formData.otherVehicle?.insuranceCompany || '',
            policy: formData.otherVehicle?.insurancePolicy || ''
          },
          driverName: formData.otherDriver?.name || '',
          driverPhone: formData.otherDriver?.phone || '',
          driverAddress: formData.otherDriver?.address || '',
          driverLicense: formData.otherDriver?.licenseNumber || '',
          insuredName: formData.otherInsured?.name || '',
          insuredPhone: formData.otherInsured?.phone || '',
          insuredAddress: formData.otherInsured?.address || ''
        },
        geolocation: {
          lat: formData.geolocation?.lat || 0,
          lng: formData.geolocation?.lng || 0,
          address: formData.geolocation?.address || '',
          accuracy: formData.geolocation?.accuracy || 0,
          timestamp: formData.geolocation?.timestamp || new Date().toISOString()
        },
        schemeData: formData.schemeData,
        schemeImageUrl: schemeImageUrl
      };

      const response = await saveAccidentReport(apiData);
      
      if (response && response.id) {
        setReportId(response.id);
        setRegistrationSuccess(true);
        toast.success('Votre constat a été enregistré avec succès');
        return true;
      } else {
        throw new Error('La réponse du serveur ne contient pas d\'ID');
      }
    } catch (error) {
      console.error('Error registering report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement';
      setRegistrationError(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isRegistering,
    registrationError,
    registrationSuccess,
    reportId,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId, 
    setReferenceId,
    registerReport
  };
};
