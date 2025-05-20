
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export interface GeolocationData {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number;
  timestamp?: string | number;
}

interface FormData {
  userId?: string;
  geolocation?: GeolocationData;
  // Autres propriétés du formulaire
}

interface RegisterReportParams {
  formData: FormData;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface RegisterAccidentResponse {
  success: boolean;
  reportId: string;
  message: string;
}

/**
 * Hook pour l'enregistrement officiel du rapport d'accident
 */
export const useRegisterReport = ({ formData, onSuccess, onError }: RegisterReportParams) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<Error | null>(null);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  
  const registerMutation = useMutation({
    mutationFn: async (): Promise<RegisterAccidentResponse> => {
      // Récupérer l'userId depuis formData ou utiliser "anonymous" comme valeur par défaut
      const userId = formData.userId || 'anonymous';
      
      // Construire les données de géolocalisation en incluant accuracy et timestamp
      const geoData = formData.geolocation ? {
        lat: formData.geolocation.lat,
        lng: formData.geolocation.lng,
        address: formData.geolocation.address,
        accuracy: formData.geolocation.accuracy || 0,
        timestamp: formData.geolocation.timestamp || new Date().toISOString()
      } : null;
      
      // Simuler une requête API réussie
      return new Promise((resolve) => {
        setTimeout(() => {
          const generatedReportId = `R-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          setReportId(generatedReportId);
          setReferenceId(generatedReportId);
          setRegistrationSuccess(true);
          
          resolve({
            success: true,
            reportId: generatedReportId,
            message: "Rapport d'accident enregistré avec succès"
          });
        }, 1500);
      });
    },
    onSuccess: (data) => {
      setRegistrationSuccess(true);
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      setRegistrationError(error);
      if (onError) onError(error);
    },
    onSettled: () => {
      setIsRegistering(false);
    }
  });
  
  const registerReport = async () => {
    setIsRegistering(true);
    return registerMutation.mutateAsync();
  };
  
  return {
    registerReport,
    isRegistering,
    reportId,
    referenceId,
    isSuccess: registerMutation.isSuccess,
    isError: registerMutation.isError,
    error: registerMutation.error,
    registrationSuccess,
    registrationError,
    showOfficialDialog,
    setShowOfficialDialog,
    setReferenceId
  };
};
