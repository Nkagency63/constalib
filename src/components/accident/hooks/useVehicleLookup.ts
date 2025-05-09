
import { VehicleLookupState, VehicleLookupActions, UseVehicleLookupProps } from './lookupState';
import { useVehicleLookupState } from './vehicle/useVehicleLookupState';
import { useSivLookup } from './vehicle/useSivLookup';
import { useFniLookup } from './vehicle/useFniLookup';
import { useFvaLookup } from './vehicle/useFvaLookup';

export const useVehicleLookup = ({
  licensePlate,
  handleInputChange,
  setVehicleInfo,
  setInsuranceInfo
}: UseVehicleLookupProps): [VehicleLookupState, VehicleLookupActions] => {
  // Use the extracted state management hook
  const { state, updateState } = useVehicleLookupState();

  // Use the extracted lookup hooks
  const lookupVehicle = useSivLookup(licensePlate, handleInputChange, setVehicleInfo, setInsuranceInfo, updateState);
  const lookupFni = useFniLookup(licensePlate, handleInputChange, setVehicleInfo, setInsuranceInfo, updateState);
  const lookupFva = useFvaLookup(licensePlate, handleInputChange, setVehicleInfo, setInsuranceInfo, updateState);

  const resetLookups = () => {
    updateState({
      lookupSuccess: false,
      searchError: null,
      fniLookupSuccess: false,
      fniError: null,
      fvaLookupSuccess: false,
      fvaError: null,
      showFvaDetails: false
    });
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
