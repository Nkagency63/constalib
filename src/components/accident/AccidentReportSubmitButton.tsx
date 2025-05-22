
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from './types';

interface AccidentReportSubmitButtonProps {
  formData: FormData;
  submitReport: () => Promise<void>;
  isSubmitting: boolean;
}

const AccidentReportSubmitButton = ({ formData, submitReport, isSubmitting }: AccidentReportSubmitButtonProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const handleSubmitOfficial = async () => {
    try {
      setIsRegistering(true);
      
      // First, submit the regular report
      await submitReport();
      
      // Then, initiate the official registration process
      const { data, error } = await supabase.functions.invoke('register-accident-report', {
        body: {
          reportData: formData,
          vehicleA: {
            brand: formData.vehicleBrand,
            model: formData.vehicleModel,
            licensePlate: formData.licensePlate,
            insuranceCompany: formData.insuranceCompany,
            insurancePolicy: formData.insurancePolicy,
          },
          vehicleB: {
            brand: formData.otherVehicle.brand,
            model: formData.otherVehicle.model,
            licensePlate: formData.otherVehicle.licensePlate,
            insuranceCompany: formData.otherVehicle.insuranceCompany,
            insurancePolicy: formData.otherVehicle.insurancePolicy,
          },
          timestamp: new Date().toISOString(),
          geolocation: formData.geolocation,
          circumstances: {
            vehicleA: formData.vehicleACircumstances || [],
            vehicleB: formData.vehicleBCircumstances || [],
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Constat enregistré officiellement auprès des services de l'assurance", {
        description: "Un email de confirmation vous sera envoyé avec les détails"
      });
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement officiel:", error);
      toast.error("Erreur lors de l'enregistrement officiel", {
        description: error.message || "Veuillez réessayer ultérieurement"
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="flex flex-col w-full gap-2">
      <Button
        onClick={submitReport}
        disabled={isSubmitting || isRegistering}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin w-4 h-4 mr-2 border-2 border-t-transparent rounded-full" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Soumettre le constat
          </>
        )}
      </Button>
      
      <Button
        onClick={handleSubmitOfficial}
        disabled={isSubmitting || isRegistering}
        variant="outline"
        className="w-full border-constalib-blue text-constalib-blue hover:bg-constalib-blue/10"
      >
        {isRegistering ? (
          <>
            <div className="animate-spin w-4 h-4 mr-2 border-2 border-t-transparent rounded-full border-constalib-blue" />
            Enregistrement officiel en cours...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Enregistrer officiellement (e-constat)
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-1">
        L'enregistrement officiel transmet votre constat directement aux services d'assurance conformément au processus e-constat auto
      </p>
    </div>
  );
};

export default AccidentReportSubmitButton;
