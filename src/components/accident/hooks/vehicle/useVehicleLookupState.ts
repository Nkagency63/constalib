
import { useState } from 'react';
import { VehicleLookupState, initialLookupState } from '../lookupState';

export const useVehicleLookupState = () => {
  const [state, setState] = useState<VehicleLookupState>(initialLookupState);
  
  const updateState = (newState: Partial<VehicleLookupState>) => {
    setState(prevState => ({
      ...prevState,
      ...newState
    }));
  };
  
  return {
    state,
    updateState
  };
};
