
import { useState } from 'react';
import { VehicleLookupState } from '../lookupState';

export const useVehicleLookupState = () => {
  const [state, setState] = useState<VehicleLookupState>({
    isLoading: false,
    lookupSuccess: false,
    vehicleDetails: null,
    searchError: null,
    isInsuranceLoading: false,
    insuranceDetails: null,
    insuranceLookupSuccess: false,
    insuranceError: null,
    autoInsuranceFound: false,
    isFvaLoading: false,
    fvaData: null,
    fvaLookupSuccess: false,
    fvaError: null,
    showFvaDetails: false,
    isFniLoading: false,
    fniLookupSuccess: false,
    fniError: null,
    hasAttemptedLookup: false
  });

  const updateState = (newState: Partial<VehicleLookupState>) => {
    setState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  return { state, updateState };
};
