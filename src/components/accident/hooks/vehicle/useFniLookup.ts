
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
      hasAttemptedLookup: true
    });
    
    const result = await lookupVehicleFromFni(licensePlate, setVehicleInfo, handleInputChange, setInsuranceInfo);
    
    if (result.success) {
      updateState({
        vehicleDetails: result.vehicleDetails,
        fniLookupSuccess: true,
        insuranceDetails: result.insuranceDetails,
        insuranceLookupSuccess: result.autoInsuranceFound,
        autoInsuranceFound: result.autoInsuranceFound
      });
      toast.success("Informations du véhicule récupérées avec succès du FNI");
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
