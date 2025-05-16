
import { validateLicensePlate } from './vehicleLookupValidators';
import { lookupVehicleFromSiv } from '../vehicleLookupService';
import { toast } from 'sonner';
import { UseVehicleLookupProps } from '../lookupState';

export const useSivLookup = (
  licensePlate: string,
  handleInputChange: UseVehicleLookupProps['handleInputChange'],
  setVehicleInfo: UseVehicleLookupProps['setVehicleInfo'],
  setInsuranceInfo: UseVehicleLookupProps['setInsuranceInfo'],
  updateState: (state: any) => void
) => {
  
  const lookupVehicle = async () => {
    if (!validateLicensePlate(licensePlate, 'siv')) {
      updateState({
        searchError: "L'immatriculation doit contenir au moins 7 caractères"
      });
      return;
    }
    
    updateState({
      isLoading: true,
      searchError: null,
      lookupSuccess: false,
      hasAttemptedLookup: true
    });
    
    const result = await lookupVehicleFromSiv(licensePlate, setVehicleInfo, handleInputChange, setInsuranceInfo);
    
    if (result.success) {
      updateState({
        vehicleDetails: result.vehicleDetails,
        lookupSuccess: true,
        insuranceDetails: result.insuranceDetails,
        insuranceLookupSuccess: result.autoInsuranceFound,
        autoInsuranceFound: result.autoInsuranceFound
      });
    } else {
      updateState({
        searchError: result.error
      });
      toast.error(result.error || "Aucun véhicule trouvé avec cette immatriculation");
    }
    
    updateState({ isLoading: false });
  };

  return lookupVehicle;
};
