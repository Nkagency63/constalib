
import { useState } from 'react';
import { toast } from 'sonner';
import { FormData } from '@/components/accident/types';

export const useRegisterReport = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const registerReport = async (formData: FormData) => {
    setIsRegistering(true);
    setRegistrationError(null);
    
    try {
      // Ici nous simulons l'enregistrement du rapport
      // Dans une application réelle, vous appelleriez votre API
      console.log("Enregistrement du constat avec les données:", formData);
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRegistrationSuccess(true);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du constat:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      setRegistrationError(errorMessage);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerReport,
    isRegistering,
    registrationError,
    registrationSuccess
  };
};
