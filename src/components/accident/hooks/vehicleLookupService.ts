import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VehicleData, InsuranceData, FvaData } from '../types/vehicleTypes';

/**
 * Generic interface for lookup responses
 */
interface LookupResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * Base function for vehicle lookups with common error handling and response formatting
 */
const performLookup = async <T>(
  functionName: string,
  data: object,
  errorMessage: string
): Promise<LookupResponse<T>> => {
  try {
    const { data: responseData, error } = await supabase.functions.invoke(functionName, {
      body: data
    });

    if (error) {
      console.error(`Error in ${functionName}:`, error);
      
      // Check if it's a 404 error (Not Found)
      if (error.message && error.message.includes('non-2xx status code')) {
        // For 404 responses, we return a formatted error about the vehicle not being found
        // The actual message will come from the edge function
        return { 
          success: false, 
          data: null, 
          error: `Aucun véhicule trouvé avec cette immatriculation. Vérifiez votre saisie.` 
        };
      }
      
      toast.error(errorMessage);
      return { 
        success: false, 
        data: null, 
        error: `Une erreur technique est survenue lors de la consultation. Veuillez réessayer plus tard.` 
      };
    }

    return { 
      success: responseData.success, 
      data: responseData.data as T, 
      error: responseData.success ? null : (responseData.message || null)
    };
  } catch (err) {
    console.error(`Error in ${functionName}:`, err);
    return { 
      success: false, 
      data: null,
      error: `Une erreur est survenue lors de la consultation. Veuillez réessayer plus tard.`
    };
  }
};

/**
 * Handle insurance data update in the form
 */
const processInsuranceData = (
  insuranceData: any,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setInsuranceInfo?: (data: {company: string}) => void
): boolean => {
  if (!insuranceData) return false;
  
  const policyEvent = {
    target: {
      name: 'insurancePolicy',
      value: insuranceData.policy
    }
  } as React.ChangeEvent<HTMLInputElement>;
  handleInputChange(policyEvent);
  
  const companyEvent = {
    target: {
      name: 'insuranceCompany',
      value: insuranceData.company
    }
  } as React.ChangeEvent<HTMLInputElement>;
  handleInputChange(companyEvent);
  
  if (setInsuranceInfo) {
    setInsuranceInfo({ company: insuranceData.company });
  }
  
  toast.success("Informations d'assurance récupérées automatiquement");
  return true;
};

/**
 * Service for looking up vehicle information from SIV
 */
export const lookupVehicleFromSiv = async (
  licensePlate: string,
  setVehicleInfo: (data: {brand: string, model: string, year?: string, firstRegistration?: string}) => void,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setInsuranceInfo?: (data: {company: string}) => void
): Promise<{ 
  success: boolean; 
  vehicleDetails: VehicleData | null; 
  insuranceDetails: InsuranceData | null;
  error: string | null;
  autoInsuranceFound: boolean;
}> => {
  console.log(`Tentative de recherche du véhicule: ${licensePlate}`);
  
  const result = await performLookup<VehicleData>(
    'lookup-vehicle', 
    { licensePlate }, 
    "Erreur lors de la consultation du SIV"
  );
  
  if (!result.success || !result.data) {
    return { 
      success: false, 
      vehicleDetails: null, 
      insuranceDetails: null,
      error: result.error || "Aucun véhicule trouvé avec cette immatriculation dans le SIV. Vérifiez votre saisie.",
      autoInsuranceFound: false
    };
  }

  const vehicleData = result.data;
  console.log('Véhicule trouvé:', vehicleData);
  
  // Make sure the year property has a value before passing to setVehicleInfo
  const dataWithYear = {
    ...vehicleData,
    year: vehicleData.year || '' 
  };
  
  // Update form with vehicle information
  setVehicleInfo(dataWithYear);
  
  let insuranceDetails = null;
  let autoInsuranceFound = false;
  
  if (vehicleData.insurance) {
    autoInsuranceFound = true;
    insuranceDetails = {
      company: vehicleData.insurance.company,
      name: vehicleData.insurance.name
    };
    
    processInsuranceData(vehicleData.insurance, handleInputChange, setInsuranceInfo);
  }
  
  toast.success("Informations du véhicule récupérées avec succès du SIV");
  
  return { 
    success: true, 
    vehicleDetails: {...vehicleData, source: "SIV"},
    insuranceDetails,
    error: null,
    autoInsuranceFound
  };
};

/**
 * Service for looking up vehicle information from FNI
 */
export const lookupVehicleFromFni = async (
  licensePlate: string,
  setVehicleInfo: (data: {brand: string, model: string, year?: string, firstRegistration?: string}) => void,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setInsuranceInfo?: (data: {company: string}) => void
): Promise<{ 
  success: boolean; 
  vehicleDetails: VehicleData | null; 
  insuranceDetails: InsuranceData | null;
  error: string | null;
  autoInsuranceFound: boolean;
}> => {
  console.log(`Tentative de recherche du véhicule dans le FNI: ${licensePlate}`);
  
  const result = await performLookup<VehicleData>(
    'lookup-fni', 
    { licensePlate }, 
    "Erreur lors de la consultation du FNI"
  );
  
  if (!result.success || !result.data) {
    return { 
      success: false, 
      vehicleDetails: null, 
      insuranceDetails: null,
      error: result.error || "Aucun véhicule trouvé avec cette immatriculation dans le FNI. Vérifiez votre saisie.",
      autoInsuranceFound: false
    };
  }

  const vehicleData = result.data;
  console.log('Véhicule trouvé dans le FNI:', vehicleData);
  
  // Make sure the year property has a value before passing to setVehicleInfo
  const dataWithYear = {
    ...vehicleData,
    year: vehicleData.year || '' 
  };
  
  // Update form with vehicle information
  setVehicleInfo(dataWithYear);
  
  let insuranceDetails = null;
  let autoInsuranceFound = false;
  
  if (vehicleData.insurance) {
    autoInsuranceFound = true;
    insuranceDetails = {
      company: vehicleData.insurance.company,
      name: vehicleData.insurance.name
    };
    
    processInsuranceData(vehicleData.insurance, handleInputChange, setInsuranceInfo);
  }
  
  toast.success("Informations du véhicule récupérées avec succès du FNI");
  
  return { 
    success: true, 
    vehicleDetails: {...vehicleData, source: "FNI"},
    insuranceDetails,
    error: null,
    autoInsuranceFound
  };
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
  console.log(`Tentative de recherche du véhicule dans le FVA: ${licensePlate}`);
  
  const result = await performLookup<FvaData>(
    'lookup-fva', 
    { licensePlate }, 
    "Erreur lors de la consultation du FVA"
  );
  
  if (!result.success || !result.data) {
    return { 
      success: false, 
      vehicleDetails: null, 
      fvaData: null,
      error: result.error || "Aucun véhicule trouvé avec cette immatriculation dans le FVA. Vérifiez votre saisie."
    };
  }

  const fvaData = result.data;
  console.log('Véhicule trouvé dans le FVA:', fvaData);
  
  const vehicleInfo = {
    brand: fvaData.vehicleInfo.brand,
    model: fvaData.vehicleInfo.model,
    year: fvaData.vehicleInfo.firstRegistration.substring(0, 4),
    firstRegistration: fvaData.vehicleInfo.firstRegistration,
  };
  
  // Update form with vehicle information
  setVehicleInfo(vehicleInfo);
  
  const vehicleDetails: VehicleData = {
    ...vehicleInfo,
    source: "FVA"
  };
  
  // Update form fields with the vehicle information
  const brandEvent = {
    target: {
      name: 'vehicleBrand',
      value: fvaData.vehicleInfo.brand
    }
  } as React.ChangeEvent<HTMLInputElement>;
  handleInputChange(brandEvent);
  
  const modelEvent = {
    target: {
      name: 'vehicleModel',
      value: fvaData.vehicleInfo.model
    }
  } as React.ChangeEvent<HTMLInputElement>;
  handleInputChange(modelEvent);
  
  const yearEvent = {
    target: {
      name: 'vehicleYear',
      value: fvaData.vehicleInfo.firstRegistration.substring(0, 4)
    }
  } as React.ChangeEvent<HTMLInputElement>;
  handleInputChange(yearEvent);
  
  // Update insurance information if available
  if (setInsuranceInfo) {
    setInsuranceInfo({ company: fvaData.insuranceInfo.company });
  }
  
  const insuranceInfo = {
    policy: fvaData.insuranceInfo.policyNumber,
    company: fvaData.insuranceInfo.company
  };
  
  processInsuranceData(insuranceInfo, handleInputChange, setInsuranceInfo);
  
  toast.success("Informations complètes récupérées du FVA avec succès");
  
  return { 
    success: true, 
    vehicleDetails,
    fvaData,
    error: null
  };
};
