
import { useState } from 'react';
import { toast } from "sonner";
import { FormData } from '@/components/accident/types';
import { supabase } from '@/integrations/supabase/client';

export interface RegisterReportResult {
  isRegistering: boolean;
  registrationSuccess: boolean;
  registrationError: string | null;
  reportId: string | null;
  showOfficialDialog: boolean;
  setShowOfficialDialog: (show: boolean) => void;
  referenceId: string | null;
  setReferenceId: (id: string | null) => void;
  registerReport: (formData: FormData) => Promise<boolean>;
}

export const useRegisterReport = (): RegisterReportResult => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  
  // État pour le dialogue d'enregistrement officiel
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  
  const registerReport = async (formData: FormData): Promise<boolean> => {
    setIsRegistering(true);
    setRegistrationError(null);
    
    try {
      console.log("Preprocessing form data for submission...");
      
      // S'assurer que les propriétés requises existent
      const processedGeolocation = {
        lat: formData.geolocation?.lat || 0,
        lng: formData.geolocation?.lng || 0,
        address: formData.geolocation?.address || '',
        accuracy: formData.geolocation?.accuracy || 0,
        timestamp: formData.geolocation?.timestamp || new Date().toISOString()
      };
      
      // Préparer les données pour l'enregistrement
      const reportData = {
        userId: formData.userId || 'anonymous',
        date: formData.date,
        time: formData.time,
        location: formData.location || '',
        description: formData.description || '',
        hasMaterialDamage: formData.hasMaterialDamage,
        materialDamageDescription: formData.materialDamageDescription || '',
        hasInjuries: formData.hasInjuries,
        injuriesDescription: formData.injuriesDescription || '',
        hasWitnesses: formData.hasWitnesses,
        geolocation: processedGeolocation,
        vehicleA: {
          licensePlate: formData.licensePlate || '',
          brand: formData.vehicleBrand || '',
          model: formData.vehicleModel || '',
          year: formData.vehicleYear || '',
          insurancePolicy: formData.insurancePolicy || '',
          insuranceCompany: formData.insuranceCompany || ''
        },
        vehicleB: {
          licensePlate: formData.otherVehicle?.licensePlate || '',
          brand: formData.otherVehicle?.brand || '',
          model: formData.otherVehicle?.model || '',
          year: formData.otherVehicle?.year || '',
          insurancePolicy: formData.otherVehicle?.insurancePolicy || '',
          insuranceCompany: formData.otherVehicle?.insuranceCompany || ''
        }
      };
      
      console.log("Submitting accident report data:", JSON.stringify(reportData));
      
      // Envoyer les données à Supabase
      const { data, error } = await supabase
        .from('accident_reports')
        .insert([reportData])
        .select();
        
      if (error) {
        console.error("Error registering report:", error);
        throw new Error(`Erreur lors de l'enregistrement du constat: ${error.message}`);
      }
      
      console.log("Report registered successfully:", data);
      
      // Générer un ID de référence unique pour le suivi
      const generatedRefId = `CNS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setReferenceId(generatedRefId);
      
      // Si l'enregistrement réussit, définir l'ID du rapport et marquer comme réussi
      if (data && data.length > 0) {
        setReportId(data[0].id);
        setRegistrationSuccess(true);
        toast.success(`Constat enregistré avec succès. Référence: ${generatedRefId}`);
        return true;
      } else {
        throw new Error("Aucune donnée renvoyée après l'enregistrement");
      }
    } catch (error) {
      console.error("Error in registerReport:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement";
      setRegistrationError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isRegistering,
    registrationSuccess,
    registrationError,
    reportId,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    setReferenceId,
    registerReport
  };
};
