
import { validateLicensePlate } from './vehicleLookupValidators';
import { lookupVehicleFromFva } from '../vehicleLookupService';
import { toast } from 'sonner';
import { UseVehicleLookupProps } from '../lookupState';

export const useFvaLookup = (
  licensePlate: string,
  handleInputChange: UseVehicleLookupProps['handleInputChange'],
  setVehicleInfo: UseVehicleLookupProps['setVehicleInfo'],
  setInsuranceInfo: UseVehicleLookupProps['setInsuranceInfo'],
  updateState: (state: any) => void
) => {
  
  const lookupFva = async () => {
    if (!validateLicensePlate(licensePlate, 'siv')) {
      updateState({
        fvaError: "L'immatriculation doit contenir au moins 5 caractères"
      });
      return;
    }
    
    updateState({
      isFvaLoading: true,
      fvaError: null,
      fvaLookupSuccess: false,
      hasAttemptedLookup: true,
      showFvaDetails: false
    });
    
    const result = await lookupVehicleFromFva(licensePlate, setVehicleInfo, handleInputChange, setInsuranceInfo);
    
    if (result.success) {
      updateState({
        vehicleDetails: result.vehicleDetails,
        fvaData: result.fvaData,
        fvaLookupSuccess: true,
        showFvaDetails: true,
        insuranceLookupSuccess: true,
        autoInsuranceFound: true,
        lookupSuccess: true
      });
      toast.success("Informations complètes récupérées du Fichier des Véhicules Assurés");
    } else {
      updateState({
        fvaError: result.error
      });
      toast.error(result.error || "Aucun véhicule trouvé avec cette immatriculation dans le FVA");
    }
    
    updateState({ isFvaLoading: false });
  };

  return lookupFva;
};
