
import { useState } from 'react';
import { Search, AlertCircle, Loader2, Check, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { InsuranceData } from '../types/vehicleTypes';

interface InsuranceInfoFieldsProps {
  insurancePolicy: string;
  insuranceCompany: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  insuranceLookupSuccess: boolean;
  insuranceDetails: InsuranceData | null;
  autoInsuranceFound: boolean;
  setInsuranceLookupSuccess: (success: boolean) => void;
  setInsuranceDetails: (details: InsuranceData | null) => void;
  setInsuranceInfo?: (data: {company: string}) => void;
}

const InsuranceInfoFields = ({
  insurancePolicy,
  insuranceCompany,
  handleInputChange,
  insuranceLookupSuccess,
  insuranceDetails,
  autoInsuranceFound,
  setInsuranceLookupSuccess,
  setInsuranceDetails,
  setInsuranceInfo
}: InsuranceInfoFieldsProps) => {
  const [isInsuranceLoading, setIsInsuranceLoading] = useState(false);
  const [insuranceError, setInsuranceError] = useState<string | null>(null);

  const lookupInsurance = async () => {
    if (!insurancePolicy) {
      toast.error("Veuillez saisir un numéro de police d'assurance");
      setInsuranceError("Le numéro de police d'assurance est requis");
      return;
    }

    setIsInsuranceLoading(true);
    setInsuranceError(null);
    setInsuranceLookupSuccess(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('lookup-insurance', {
        body: { policyNumber: insurancePolicy }
      });

      if (error) {
        toast.error("Erreur lors de la consultation du fichier des assurances");
        setInsuranceError("Une erreur technique est survenue lors de la consultation");
        console.error('Error looking up insurance:', error);
        return;
      }

      if (data.success && data.data) {
        if (setInsuranceInfo) {
          setInsuranceInfo({ company: data.data.company });
        }
        
        const syntheticEvent = {
          target: {
            name: 'insuranceCompany',
            value: data.data.company
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(syntheticEvent);
        
        setInsuranceDetails(data.data);
        setInsuranceLookupSuccess(true);
        toast.success(data.message || "Informations d'assurance récupérées avec succès");
      } else {
        setInsuranceError(data.message || "Aucune assurance trouvée avec ce numéro de police");
        toast.error(data.message || "Aucune assurance trouvée avec ce numéro de police");
      }
    } catch (err) {
      console.error('Error in insurance lookup:', err);
      setInsuranceError("Une erreur est survenue lors de la consultation");
      toast.error("Une erreur est survenue lors de la consultation");
    } finally {
      setIsInsuranceLoading(false);
    }
  };

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-medium text-constalib-dark mb-4 flex items-center">
        <Shield className="h-5 w-5 mr-2 text-constalib-blue" />
        Assurance du véhicule
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="insurancePolicy" className="block text-sm font-medium text-constalib-dark">
            Numéro de police d'assurance
          </label>
          <div className="relative">
            <Input
              type="text"
              id="insurancePolicy"
              name="insurancePolicy"
              value={insurancePolicy}
              onChange={handleInputChange}
              className="pr-12"
              readOnly={autoInsuranceFound}
            />
            {!autoInsuranceFound && (
              <Button 
                type="button" 
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={lookupInsurance}
                disabled={isInsuranceLoading}
              >
                {isInsuranceLoading ? 
                  <Loader2 className="h-5 w-5 animate-spin text-constalib-blue" /> : 
                  insuranceLookupSuccess ? 
                    <Check className="h-5 w-5 text-green-600" /> : 
                    <Search className="h-5 w-5 text-constalib-blue" />
                }
              </Button>
            )}
          </div>
          {insuranceError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{insuranceError}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="insuranceCompany" className="block text-sm font-medium text-constalib-dark">
            Compagnie d'assurance
          </label>
          <Input
            type="text"
            id="insuranceCompany"
            name="insuranceCompany"
            value={insuranceCompany}
            onChange={handleInputChange}
            readOnly={insuranceLookupSuccess}
          />
        </div>
      </div>
      
      {insuranceLookupSuccess && insuranceDetails && (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Assurance vérifiée : {insuranceDetails.company}
            {insuranceDetails.name && 
              <div className="text-xs mt-1">{insuranceDetails.name}</div>
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default InsuranceInfoFields;
