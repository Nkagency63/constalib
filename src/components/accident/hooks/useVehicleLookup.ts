
import { useState } from 'react';
import { toast } from 'sonner';
import { VehicleData, InsuranceData, FvaData } from '../types/vehicleTypes';
import { VehicleLookupState, VehicleLookupActions, UseVehicleLookupProps, initialLookupState } from './lookupState';
import { isValidLicensePlate } from './vehicleLookupValidation';
import { 
  lookupVehicleFromSiv, 
  lookupVehicleFromFni, 
  lookupVehicleFromFva 
} from './vehicleLookupService';

export const useVehicleLookup = ({
  licensePlate,
  handleInputChange,
  setVehicleInfo,
  setInsuranceInfo
}: UseVehicleLookupProps): [VehicleLookupState, VehicleLookupActions] => {
  // Initialize state using the initialLookupState object
  const [
    { 
      isLoading, 
      lookupSuccess, 
      vehicleDetails, 
      searchError,
      isInsuranceLoading,
      insuranceDetails,
      insuranceLookupSuccess,
      insuranceError,
      autoInsuranceFound,
      isFvaLoading,
      fvaData,
      fvaLookupSuccess,
      fvaError,
      showFvaDetails,
      isFniLoading,
      fniLookupSuccess,
      fniError,
      hasAttemptedLookup
    }, 
    setState
  ] = useState<VehicleLookupState>(initialLookupState);

  // Helper to update state partially
  const updateState = (newState: Partial<VehicleLookupState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  const resetLookups = () => {
    updateState({
      lookupSuccess: false,
      searchError: null,
      fniLookupSuccess: false,
      fniError: null
    });
  };

  const lookupVehicle = async () => {
    if (!isValidLicensePlate(licensePlate, 'siv')) {
      toast.error("Veuillez saisir une immatriculation valide");
      updateState({
        searchError: "L'immatriculation doit contenir au moins 5 caractères"
      });
      return;
    }

    updateState({
      isLoading: true,
      searchError: null,
      lookupSuccess: false,
      autoInsuranceFound: false,
      hasAttemptedLookup: true
    });
    
    const result = await lookupVehicleFromSiv(licensePlate, setVehicleInfo, handleInputChange, setInsuranceInfo);
    
    if (result.success) {
      updateState({
        vehicleDetails: result.vehicleDetails,
        lookupSuccess: true,
        insuranceDetails: result.insuranceDetails,
        autoInsuranceFound: result.autoInsuranceFound,
        insuranceLookupSuccess: result.autoInsuranceFound
      });
    } else {
      updateState({
        searchError: result.error
      });
      toast.error(result.error || "Aucun véhicule trouvé avec cette immatriculation dans le SIV");
    }
    
    updateState({ isLoading: false });
  };

  const lookupFni = async () => {
    if (!isValidLicensePlate(licensePlate, 'fni')) {
      toast.error("Veuillez saisir une immatriculation valide");
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
      hasAttemptedLookup: true
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
    } else {
      updateState({
        fniError: result.error
      });
      toast.error(result.error || "Aucun véhicule trouvé avec cette immatriculation dans le FNI");
    }
    
    updateState({ isFniLoading: false });
  };

  const lookupFva = async () => {
    if (!isValidLicensePlate(licensePlate, 'siv')) {
      toast.error("Veuillez saisir une immatriculation valide");
      updateState({
        fvaError: "L'immatriculation doit contenir au moins 5 caractères"
      });
      return;
    }
    
    updateState({
      isFvaLoading: true,
      fvaError: null,
      fvaLookupSuccess: false,
      hasAttemptedLookup: true
    });
    
    const result = await lookupVehicleFromFva(licensePlate, setVehicleInfo, handleInputChange, setInsuranceInfo);
    
    if (result.success) {
      updateState({
        vehicleDetails: result.vehicleDetails,
        fvaData: result.fvaData,
        fvaLookupSuccess: true,
        showFvaDetails: true,
        insuranceLookupSuccess: true,
        autoInsuranceFound: true
      });
    } else {
      updateState({
        fvaError: result.error
      });
      toast.error(result.error || "Aucun véhicule trouvé avec cette immatriculation dans le FVA");
    }
    
    updateState({ isFvaLoading: false });
  };

  const state: VehicleLookupState = {
    isLoading,
    lookupSuccess,
    vehicleDetails,
    searchError,
    isInsuranceLoading,
    insuranceDetails,
    insuranceLookupSuccess,
    insuranceError,
    autoInsuranceFound,
    isFvaLoading,
    fvaData,
    fvaLookupSuccess,
    fvaError,
    showFvaDetails,
    isFniLoading,
    fniLookupSuccess,
    fniError,
    hasAttemptedLookup
  };

  const actions: VehicleLookupActions = {
    lookupVehicle,
    lookupFni,
    lookupFva,
    resetLookups
  };

  return [state, actions];
};

export type { VehicleLookupState, VehicleLookupActions, UseVehicleLookupProps };
