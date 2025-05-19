
import React, { useState } from 'react';
import MultiVehicleStep from './MultiVehicleStep';
import { useVehicleLookup } from './hooks/useVehicleLookup';

interface VehiclesStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: (type: string, files: FileList) => void;
  setVehicleInfo: (data: any) => void;
  setOtherVehicleInfo: (data: any) => void;
}

const VehiclesStep: React.FC<VehiclesStepProps> = ({
  formData,
  handleInputChange,
  handleOtherVehicleChange,
  handlePhotoUpload,
  setVehicleInfo,
  setOtherVehicleInfo
}) => {
  const [vehicleId, setVehicleId] = useState<'A' | 'B'>('A');
  const [searchTab, setSearchTab] = useState<'siv' | 'fni'>('siv');
  
  // Use the vehicle lookup hook for vehicle A
  const [
    {
      isLoading,
      lookupSuccess,
      searchError,
      isFvaLoading,
      fvaLookupSuccess,
      fvaError,
      isFniLoading,
      fniLookupSuccess,
      fniError,
      hasAttemptedLookup
    },
    {
      lookupVehicle,
      lookupFni,
      lookupFva
    }
  ] = useVehicleLookup({
    licensePlate: formData.licensePlate || '',
    handleInputChange,
    setVehicleInfo,
    setInsuranceInfo: (data: {company: string}) => {}
  });
  
  // Use the vehicle lookup hook for vehicle B (other vehicle)
  const [
    {
      isLoading: otherIsLoading,
      lookupSuccess: otherLookupSuccess,
      searchError: otherSearchError,
      isFvaLoading: otherIsFvaLoading,
      fvaLookupSuccess: otherFvaLookupSuccess,
      fvaError: otherFvaError,
      isFniLoading: otherIsFniLoading,
      fniLookupSuccess: otherFniLookupSuccess,
      fniError: otherFniError,
      hasAttemptedLookup: otherHasAttemptedLookup
    },
    {
      lookupVehicle: lookupOtherVehicle,
      lookupFni: lookupOtherFni,
      lookupFva: lookupOtherFva
    }
  ] = useVehicleLookup({
    licensePlate: formData.otherVehicle?.licensePlate || '',
    handleInputChange: handleOtherVehicleChange,
    setVehicleInfo: setOtherVehicleInfo,
    setInsuranceInfo: (data: {company: string}) => {}
  });

  const handleSearchTabChange = (tab: 'siv' | 'fni') => {
    setSearchTab(tab);
  };

  return (
    <MultiVehicleStep
      licensePlate={formData.licensePlate || ''}
      vehicleBrand={formData.vehicleBrand || ''}
      vehicleModel={formData.vehicleModel || ''}
      vehicleYear={formData.vehicleYear || ''}
      vehicleDescription={formData.vehicleDescription || ''}
      firstRegistration={formData.firstRegistration || ''}
      insurancePolicy={formData.insurancePolicy || ''}
      insuranceCompany={formData.insuranceCompany || ''}
      otherVehicle={formData.otherVehicle || {}}
      handleInputChange={handleInputChange}
      handleOtherVehicleChange={handleOtherVehicleChange}
      setVehicleInfo={setVehicleInfo}
      setOtherVehicleInfo={setOtherVehicleInfo}
      onEmergencyContacted={() => {}}
      vehicleId={vehicleId}
      setVehicleId={setVehicleId}
      emergencyContacted={formData.emergencyContacted || false}
      handlePhotoUpload={handlePhotoUpload}
      // Vehicle A lookup methods
      lookupVehicle={lookupVehicle}
      lookupFni={lookupFni}
      lookupFva={lookupFva}
      isLoading={isLoading}
      isFvaLoading={isFvaLoading}
      isFniLoading={isFniLoading}
      lookupSuccess={lookupSuccess}
      fvaLookupSuccess={fvaLookupSuccess}
      fniLookupSuccess={fniLookupSuccess}
      searchError={searchError}
      fvaError={fvaError}
      fniError={fniError}
      hasAttemptedLookup={hasAttemptedLookup}
      searchTab={searchTab}
      onSearchTabChange={handleSearchTabChange}
      // Vehicle B lookup methods
      lookupOtherVehicle={lookupOtherVehicle}
      lookupOtherFni={lookupOtherFni}
      lookupOtherFva={lookupOtherFva}
      otherIsLoading={otherIsLoading}
      otherIsFvaLoading={otherIsFvaLoading}
      otherIsFniLoading={otherIsFniLoading}
      otherLookupSuccess={otherLookupSuccess}
      otherFvaLookupSuccess={otherFvaLookupSuccess}
      otherFniLookupSuccess={otherFniLookupSuccess}
      otherSearchError={otherSearchError}
      otherFvaError={otherFvaError}
      otherFniError={otherFniError}
      otherHasAttemptedLookup={otherHasAttemptedLookup}
    />
  );
};

export default VehiclesStep;
