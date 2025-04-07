
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VehicleData, InsuranceData, FvaData } from '../types/vehicleTypes';

/**
 * Service for looking up vehicle information from SIV
 */
export const lookupVehicleFromSiv = async (
  licensePlate: string,
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setInsuranceInfo?: (data: {company: string}) => void
): Promise<{ 
  success: boolean; 
  vehicleDetails: VehicleData | null; 
  insuranceDetails: InsuranceData | null;
  error: string | null;
  autoInsuranceFound: boolean;
}> => {
  try {
    console.log(`Tentative de recherche du véhicule: ${licensePlate}`);
    const { data, error } = await supabase.functions.invoke('lookup-vehicle', {
      body: { licensePlate }
    });

    if (error) {
      console.error('Error looking up vehicle:', error);
      toast.error("Erreur lors de la consultation du SIV");
      return { 
        success: false, 
        vehicleDetails: null, 
        insuranceDetails: null,
        error: "Une erreur technique est survenue lors de la consultation du SIV. Veuillez réessayer plus tard.",
        autoInsuranceFound: false
      };
    }

    if (data.success && data.data) {
      console.log('Véhicule trouvé:', data.data);
      setVehicleInfo(data.data);
      
      let insuranceDetails = null;
      let autoInsuranceFound = false;
      
      if (data.data.insurance) {
        autoInsuranceFound = true;
        insuranceDetails = {
          company: data.data.insurance.company,
          name: data.data.insurance.name
        };
        
        const policyEvent = {
          target: {
            name: 'insurancePolicy',
            value: data.data.insurance.policy
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(policyEvent);
        
        const companyEvent = {
          target: {
            name: 'insuranceCompany',
            value: data.data.insurance.company
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(companyEvent);
        
        if (setInsuranceInfo) {
          setInsuranceInfo({ company: data.data.insurance.company });
        }
        
        toast.success("Informations d'assurance récupérées automatiquement");
      }
      
      toast.success(data.message || "Informations du véhicule récupérées avec succès du SIV");
      
      return { 
        success: true, 
        vehicleDetails: {...data.data, source: "SIV"},
        insuranceDetails,
        error: null,
        autoInsuranceFound
      };
    } else {
      console.log('Véhicule non trouvé:', data);
      return { 
        success: false, 
        vehicleDetails: null,
        insuranceDetails: null,
        error: data.message || "Aucun véhicule trouvé avec cette immatriculation dans le SIV. Vérifiez votre saisie.",
        autoInsuranceFound: false
      };
    }
  } catch (err) {
    console.error('Error in vehicle lookup:', err);
    return { 
      success: false, 
      vehicleDetails: null,
      insuranceDetails: null,
      error: "Une erreur est survenue lors de la consultation du SIV. Veuillez réessayer plus tard.",
      autoInsuranceFound: false
    };
  }
};

/**
 * Service for looking up vehicle information from FNI
 */
export const lookupVehicleFromFni = async (
  licensePlate: string,
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setInsuranceInfo?: (data: {company: string}) => void
): Promise<{ 
  success: boolean; 
  vehicleDetails: VehicleData | null; 
  insuranceDetails: InsuranceData | null;
  error: string | null;
  autoInsuranceFound: boolean;
}> => {
  try {
    console.log(`Tentative de recherche du véhicule dans le FNI: ${licensePlate}`);
    const { data, error } = await supabase.functions.invoke('lookup-fni', {
      body: { licensePlate }
    });

    if (error) {
      console.error('Error looking up vehicle in FNI:', error);
      toast.error("Erreur lors de la consultation du FNI");
      return { 
        success: false, 
        vehicleDetails: null, 
        insuranceDetails: null,
        error: "Une erreur technique est survenue lors de la consultation du FNI. Veuillez réessayer plus tard.",
        autoInsuranceFound: false
      };
    }

    if (data.success && data.data) {
      console.log('Véhicule trouvé dans le FNI:', data.data);
      setVehicleInfo(data.data);
      
      let insuranceDetails = null;
      let autoInsuranceFound = false;
      
      if (data.data.insurance) {
        autoInsuranceFound = true;
        insuranceDetails = {
          company: data.data.insurance.company,
          name: data.data.insurance.name
        };
        
        const policyEvent = {
          target: {
            name: 'insurancePolicy',
            value: data.data.insurance.policy
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(policyEvent);
        
        const companyEvent = {
          target: {
            name: 'insuranceCompany',
            value: data.data.insurance.company
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(companyEvent);
        
        if (setInsuranceInfo) {
          setInsuranceInfo({ company: data.data.insurance.company });
        }
        
        toast.success("Informations d'assurance récupérées automatiquement du FNI");
      }
      
      toast.success(data.message || "Informations du véhicule récupérées avec succès du FNI");
      
      return { 
        success: true, 
        vehicleDetails: {...data.data, source: "FNI"},
        insuranceDetails,
        error: null,
        autoInsuranceFound
      };
    } else {
      console.log('Véhicule non trouvé dans le FNI:', data);
      return { 
        success: false, 
        vehicleDetails: null,
        insuranceDetails: null,
        error: data.message || "Aucun véhicule trouvé avec cette immatriculation dans le FNI. Vérifiez votre saisie.",
        autoInsuranceFound: false
      };
    }
  } catch (err) {
    console.error('Error in FNI lookup:', err);
    return { 
      success: false, 
      vehicleDetails: null,
      insuranceDetails: null,
      error: "Une erreur est survenue lors de la consultation du FNI. Veuillez réessayer plus tard.",
      autoInsuranceFound: false
    };
  }
};

/**
 * Service for looking up vehicle information from FVA
 */
export const lookupVehicleFromFva = async (
  licensePlate: string,
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setInsuranceInfo?: (data: {company: string}) => void
): Promise<{ 
  success: boolean; 
  vehicleDetails: VehicleData | null; 
  fvaData: FvaData | null;
  error: string | null;
}> => {
  try {
    console.log(`Tentative de recherche du véhicule dans le FVA: ${licensePlate}`);
    
    const normalizedPlate = licensePlate.replace(/[\s-]+/g, '').toUpperCase();
    console.log(`Plaque normalisée: ${normalizedPlate}`);
    
    const { data, error } = await supabase.functions.invoke('lookup-fva', {
      body: { licensePlate: normalizedPlate }
    });

    if (error) {
      console.error('Error looking up vehicle in FVA:', error);
      toast.error("Erreur lors de la consultation du FVA");
      return { 
        success: false, 
        vehicleDetails: null, 
        fvaData: null,
        error: "Une erreur technique est survenue lors de la consultation du FVA. Veuillez réessayer plus tard."
      };
    }

    if (data.success && data.data) {
      console.log('Véhicule trouvé dans le FVA:', data.data);
      
      setVehicleInfo({
        brand: data.data.vehicleInfo.brand,
        model: data.data.vehicleInfo.model,
        year: data.data.vehicleInfo.firstRegistration.substring(0, 4),
        firstRegistration: data.data.vehicleInfo.firstRegistration,
      });
      
      const vehicleDetails: VehicleData = {
        brand: data.data.vehicleInfo.brand,
        model: data.data.vehicleInfo.model,
        year: data.data.vehicleInfo.firstRegistration.substring(0, 4),
        firstRegistration: data.data.vehicleInfo.firstRegistration,
        source: "FVA"
      };
      
      const brandEvent = {
        target: {
          name: 'vehicleBrand',
          value: data.data.vehicleInfo.brand
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(brandEvent);
      
      const modelEvent = {
        target: {
          name: 'vehicleModel',
          value: data.data.vehicleInfo.model
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(modelEvent);
      
      const yearEvent = {
        target: {
          name: 'vehicleYear',
          value: data.data.vehicleInfo.firstRegistration.substring(0, 4)
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(yearEvent);
      
      if (setInsuranceInfo) {
        setInsuranceInfo({ company: data.data.insuranceInfo.company });
      }
      
      const policyEvent = {
        target: {
          name: 'insurancePolicy',
          value: data.data.insuranceInfo.policyNumber
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(policyEvent);
      
      const companyEvent = {
        target: {
          name: 'insuranceCompany',
          value: data.data.insuranceInfo.company
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(companyEvent);
      
      toast.success(data.message || "Informations complètes récupérées du FVA avec succès");
      
      return { 
        success: true, 
        vehicleDetails,
        fvaData: data.data,
        error: null
      };
    } else {
      console.log('Véhicule non trouvé dans le FVA:', data);
      return { 
        success: false, 
        vehicleDetails: null,
        fvaData: null,
        error: data.message || "Aucun véhicule trouvé avec cette immatriculation dans le FVA. Vérifiez votre saisie."
      };
    }
  } catch (err) {
    console.error('Error in FVA lookup:', err);
    return { 
      success: false, 
      vehicleDetails: null,
      fvaData: null,
      error: "Une erreur est survenue lors de la consultation du FVA. Veuillez réessayer plus tard."
    };
  }
};
