
import { validateLicensePlate } from './vehicleLookupValidators';
import { lookupVehicleFromFni } from '../vehicleLookupService';
import { toast } from 'sonner';
import { UseVehicleLookupProps } from '../lookupState';

export const useFniLookup = (
  licensePlate: string,
  handleInputChange: UseVehicleLookupProps['handleInputChange'],
  setVehicleInfo: UseVehicleLookupProps['setVehicleInfo'],
  setInsuranceInfo: UseVehicleLookupProps['setInsuranceInfo'],
  updateState: (state: any) => void
) => {
  
  const lookupFni = async () => {
    if (!validateLicensePlate(licensePlate, 'fni')) {
      updateState({
        fniError: "L'immatriculation doit contenir au moins 5 caractères"
      });
      return;
    }

    updateState({
      isFniLoading: true,
      fniError: null,
      fniLookupSuccess: false,
      lookupSuccess: false,
      searchError: null,
      autoInsuranceFound: false,
      hasAttemptedLookup: true,
      fvaLookupSuccess: false,
      showFvaDetails: false
    });
    
    const result = await lookupVehicleFromFni(licensePlate, setVehicleInfo, handleInputChange, setInsuranceInfo);
    
    if (result.success) {
      updateState({
        vehicleDetails: result.vehicleDetails,
        lookupSuccess: true,
        fniLookupSuccess: true,
        insuranceDetails: result.insuranceDetails,
        autoInsuranceFound: result.autoInsuranceFound,
        insuranceLookupSuccess: result.autoInsuranceFound
      });
      toast.success("Informations du véhicule récupérées (utilisez le FVA pour des informations complètes)");
    } else {
      updateState({
        fniError: result.error
      });
      toast.error(result.error || "Aucun véhicule trouvé avec cette immatriculation dans le FNI");
    }
    
    updateState({ isFniLoading: false });
  };

  return lookupFni;
};
