
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FormData } from '@/components/accident/types';

export const useRegisterReport = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const registerReport = async (formData: FormData): Promise<boolean> => {
    setIsRegistering(true);
    setRegistrationError('');
    
    try {
      // Prepare the report data
      const reportData = {
        // Include all formData here, properly formatted for your database
        userId: formData.userId || null,
        date: formData.date || new Date().toISOString(),
        time: formData.time || new Date().toTimeString().split(' ')[0],
        location: formData.location || '',
        city: formData.city || '',
        country: formData.country || 'France',
        hasInjuries: formData.hasInjuries || false,
        injuriesDescription: formData.injuriesDescription || '',
        hasWitnesses: formData.hasWitnesses || false,
        witnesses: formData.witnesses || [],
        vehicleA: {
          licensePlate: formData.licensePlate || '',
          brand: formData.vehicleBrand || '',
          model: formData.vehicleModel || '',
          year: formData.vehicleYear || '',
          description: formData.vehicleDescription || '',
          insuranceInfo: {
            company: formData.insuranceCompany || '',
            policy: formData.insurancePolicy || ''
          },
          driverName: formData.driverName || '',
          driverPhone: formData.driverPhone || '',
          driverAddress: formData.driverAddress || '',
          driverLicense: formData.driverLicense || '',
          insuredName: formData.insuredName || '',
          insuredPhone: formData.insuredPhone || '',
          insuredAddress: formData.insuredAddress || '',
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
          driverName: formData.otherDriverName || '',
          driverPhone: formData.otherDriverPhone || '',
          driverAddress: formData.otherDriverAddress || '',
          driverLicense: formData.otherDriverLicense || '',
          insuredName: formData.otherInsuredName || '',
          insuredPhone: formData.otherInsuredPhone || '',
          insuredAddress: formData.otherInsuredAddress || '',
        },
        geolocation: formData.geolocation ? {
          lat: formData.geolocation.lat,
          lng: formData.geolocation.lng,
          address: formData.geolocation.address || '',
          accuracy: formData.geolocation.accuracy || null,
          timestamp: formData.geolocation.timestamp || Date.now()
        } : null,
        schemeData: formData.schemeData || null
      };

      console.log('Registering report with data:', reportData);

      // Insert the report into the database
      const { data, error } = await supabase
        .from('accident_reports')
        .insert(reportData)
        .select()
        .single();

      if (error) {
        console.error('Error registering report:', error);
        toast.error("Erreur lors de l'enregistrement du constat");
        setRegistrationError(error.message);
        return false;
      }

      // Set the reference ID for the generated report
      setReferenceId(data.id);
      
      toast.success("Constat enregistré avec succès");
      setRegistrationSuccess(true);
      
      return true;
    } catch (err: any) {
      console.error('Unexpected error registering report:', err);
      toast.error("Une erreur inattendue s'est produite");
      setRegistrationError(err.message || "Une erreur inattendue s'est produite");
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRegisterOfficial = async (formData: FormData): Promise<string> => {
    try {
      // Implementation for registering the official report
      // This would involve sending the data to a specific endpoint or process
      console.log('Registering official report:', formData);
      
      // Return a reference number or tracking ID for the official registration
      return 'REF-123456';
    } catch (error) {
      console.error('Error registering official report:', error);
      throw error;
    }
  };

  return {
    registerReport,
    isRegistering,
    registrationError,
    registrationSuccess,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    handleRegisterOfficial
  };
};
