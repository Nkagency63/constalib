
import { useState } from 'react';
import { VehicleLookupState, initialLookupState } from '../lookupState';

/**
 * Custom hook for managing vehicle lookup state
 */
export const useVehicleLookupState = () => {
  const [state, setState] = useState<VehicleLookupState>(initialLookupState);

  // Helper to update state partially
  const updateState = (newState: Partial<VehicleLookupState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  return {
    state,
    updateState
  };
};
