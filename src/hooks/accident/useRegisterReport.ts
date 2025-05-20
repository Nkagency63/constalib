
import { useState } from 'react';
import { toast } from 'sonner';
import { FormData } from '@/components/accident/types';
import { v4 as uuidv4 } from 'uuid';
import { captureStageAsDataUrl } from '@/components/accident/scheme/SchemeExport';

export interface RegisterReportResult {
  isRegistering: boolean;
  registrationError: string | null;
  registrationSuccess: boolean;
  reportId: string | null;
  showOfficialDialog: boolean;
  setShowOfficialDialog: (show: boolean) => void;
  referenceId: string;
  setReferenceId: (id: string) => void;
  registerReport: (formData: FormData) => Promise<boolean>;
}

export const useRegisterReport = (): RegisterReportResult => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState<string>('');

  const registerReport = async (formData: FormData): Promise<boolean> => {
    setIsRegistering(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);
    
    try {
      // Capture du schéma comme image
      const schemeImageDataUrl = await captureStageAsDataUrl();
      
      // Construction des données pour l'API
      const payload = {
        ...formData,
        reportId: uuidv4(),
        schemeImageDataUrl,
        // Ajout des propriétés manquantes
        userId: formData.userId || 'anonymous',
        geolocation: {
          ...formData.geolocation,
          accuracy: formData.geolocation?.accuracy || 0,
          timestamp: formData.geolocation?.timestamp || new Date().toISOString()
        }
      };
      
      // Simulation d'un appel API réussi
      console.log("Enregistrement du rapport:", payload);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler une réponse d'API
      const simulatedResponse = {
        success: true,
        data: {
          reportId: payload.reportId,
          referenceNumber: 'CONST-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        }
      };
      
      if (simulatedResponse.success) {
        setReportId(simulatedResponse.data.reportId);
        setReferenceId(simulatedResponse.data.referenceNumber);
        setRegistrationSuccess(true);
        toast.success('Votre constat a été enregistré avec succès!');
        return true;
      } else {
        throw new Error('Erreur lors de l\'enregistrement du constat');
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      setRegistrationError(errorMessage);
      toast.error(`Échec de l'enregistrement: ${errorMessage}`);
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
