
import { WitnessInfo } from './';

export interface MultiVehicleStepProps {
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  firstRegistration: string;
  insurancePolicy: string;
  insuranceCompany: string;
  otherVehicle: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  onEmergencyContacted: () => void;
  vehicleId: 'A' | 'B';
  setVehicleId: (id: 'A' | 'B') => void;
  emergencyContacted: boolean;
  handlePhotoUpload?: (type: string, files: FileList) => void;
  // Vehicle A lookup methods
  lookupVehicle?: () => void;
  lookupFni?: () => void;
  lookupFva?: () => void;
  isLoading?: boolean;
  isFvaLoading?: boolean;
  isFniLoading?: boolean;
  lookupSuccess?: boolean;
  fvaLookupSuccess?: boolean;
  fniLookupSuccess?: boolean;
  searchError?: string | null;
  fvaError?: string | null;
  fniError?: string | null;
  hasAttemptedLookup?: boolean;
  searchTab?: 'siv' | 'fni';
  onSearchTabChange?: (tab: 'siv' | 'fni') => void;
  // Vehicle B lookup methods
  lookupOtherVehicle?: () => void;
  lookupOtherFni?: () => void;
  lookupOtherFva?: () => void;
  otherIsLoading?: boolean;
  otherIsFvaLoading?: boolean;
  otherIsFniLoading?: boolean;
  otherLookupSuccess?: boolean;
  otherFvaLookupSuccess?: boolean;
  otherFniLookupSuccess?: boolean;
  otherSearchError?: string | null;
  otherFvaError?: string | null;
  otherFniError?: string | null;
  otherHasAttemptedLookup?: boolean;
}

export interface BasicInfoStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  date: string;
  time: string;
  location: string;
}

export interface VehiclesStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: (type: string, files: FileList) => void;
  setVehicleInfo: (data: any) => void;
  setOtherVehicleInfo: (data: any) => void;
}

export interface PhotosStepProps {
  formData: any;
  handlePhotoUpload: (type: string, file: FileList) => void;
}

export interface WitnessStepProps {
  formData: any;
  setHasWitnesses: (hasWitnesses: boolean) => void;
  updateWitness: (index: number, field: keyof WitnessInfo, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
}

export interface InjuriesStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setHasInjuries: (hasInjuries: boolean) => void;
  setInjuriesDescription: (description: string) => void;
}
