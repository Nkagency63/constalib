
import { VehicleData, InsuranceData, FvaData } from '../types/vehicleTypes';

export interface VehicleLookupState {
  isLoading: boolean;
  lookupSuccess: boolean;
  vehicleDetails: VehicleData | null;
  searchError: string | null;
  isInsuranceLoading: boolean;
  insuranceDetails: InsuranceData | null;
  insuranceLookupSuccess: boolean;
  insuranceError: string | null;
  autoInsuranceFound: boolean;
  isFvaLoading: boolean;
  fvaData: FvaData | null;
  fvaLookupSuccess: boolean;
  fvaError: string | null;
  showFvaDetails: boolean;
  isFniLoading: boolean;
  fniLookupSuccess: boolean;
  fniError: string | null;
  hasAttemptedLookup: boolean;
}

export const initialLookupState: VehicleLookupState = {
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
};

export interface VehicleLookupActions {
  lookupVehicle: () => Promise<void>;
  lookupFni: () => Promise<void>;
  lookupFva: () => Promise<void>;
  resetLookups: () => void;
}

export interface UseVehicleLookupProps {
  licensePlate: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setInsuranceInfo?: (data: {company: string}) => void;
}
