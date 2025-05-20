import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/components/accident/types';

export interface RegisterReportResult {
  isRegistering: boolean;
  registrationSuccess: boolean;
  registrationError: string | null;
  reportId: string | null;
  showOfficialDialog: boolean;
  setShowOfficialDialog: (show: boolean) => void;
  referenceId: string | null;
  setReferenceId: (id: string | null) => void;
}

export const useRegisterReport = (): RegisterReportResult => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const registerReport = async (formData: FormData): Promise<boolean> => {
    setIsRegistering(true);
    setRegistrationSuccess(false);
    setRegistrationError(null);

    try {
      const { data, error } = await supabase
        .from('accident_reports')
        .insert([
          {
            ...formData,
            // Ensure geolocation is correctly structured
            geolocation: formData.geolocation
              ? {
                ...formData.geolocation,
                accuracy: formData.geolocation.accuracy || 0,
                timestamp: formData.geolocation.timestamp || new Date().toISOString(),
              }
              : { lat: 0, lng: 0, address: '', accuracy: 0, timestamp: new Date().toISOString() },
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error registering report:', error);
        setRegistrationError(error.message);
        toast.error(`Erreur lors de l'enregistrement du constat: ${error.message}`);
        return false;
      }

      setRegistrationSuccess(true);
      setReportId(data.id);
      toast.success("Constat enregistré avec succès !");
      return true;
    } catch (error: any) {
      console.error('Unexpected error during report registration:', error);
      setRegistrationError(error.message || 'An unexpected error occurred');
      toast.error(`Erreur inattendue: ${error.message || 'Une erreur inconnue est survenue'}`);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  const fetchReportById = async (reportId: string) => {
    try {
      const { data: reportData, error: reportError } = await supabase
        .from('accident_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError) {
        console.error("Error fetching report:", reportError);
        toast.error(`Erreur lors de la récupération du rapport: ${reportError.message}`);
        return null;
      }

      return reportData;
    } catch (error: any) {
      console.error("Unexpected error fetching report:", error);
      toast.error(`Erreur inattendue lors de la récupération du rapport: ${error.message}`);
      return null;
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
    registerReport,
  };
};
