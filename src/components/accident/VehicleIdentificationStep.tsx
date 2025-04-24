
import { useState } from 'react';
import { FormData } from './types';
import { VehicleData, InsuranceData, FvaData } from './types/vehicleTypes';
import LicensePlateInput from './vehicle/LicensePlateInput';
import VehicleDetailsAlerts from './vehicle/VehicleDetailsAlerts';
import VehicleInfoFields from './vehicle/VehicleInfoFields';
import InsuranceInfoFields from './vehicle/InsuranceInfoFields';
import FvaDetailsCard from './vehicle/FvaDetailsCard';
import VehicleHelpText from './vehicle/VehicleHelpText';
import { useVehicleLookup } from './hooks/useVehicleLookup';

interface VehicleIdentificationStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  onEmergencyContacted: () => void;
}

const VehicleIdentificationStep = ({
  formData,
  handleInputChange,
  handleOtherVehicleChange,
  setVehicleInfo,
  setOtherVehicleInfo,
  onEmergencyContacted
}: VehicleIdentificationStepProps) => {
  const [searchTab, setSearchTab] = useState<'siv' | 'fni'>('siv');
  
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
    {
      lookupVehicle,
      lookupFni,
      lookupFva,
      resetLookups
    }
  ] = useVehicleLookup({
    licensePlate: formData.licensePlate,
    handleInputChange,
    setVehicleInfo,
    setInsuranceInfo: (data: {company: string}) => {}
  });

  const handleSearchTabChange = (tab: 'siv' | 'fni') => {
    setSearchTab(tab);
    resetLookups();
  };

  return (
    <div className="space-y-6">
      <LicensePlateInput
        licensePlate={formData.licensePlate}
        handleInputChange={handleInputChange}
        onSearchTab={handleSearchTabChange}
        searchTab={searchTab}
        onLookupVehicle={lookupVehicle}
        onLookupFni={lookupFni}
        onLookupFva={lookupFva}
        isLoading={isLoading}
        isFvaLoading={isFvaLoading}
        isFniLoading={isFniLoading}
        lookupSuccess={lookupSuccess}
        fniLookupSuccess={fniLookupSuccess}
        searchError={searchError}
        fniError={fniError}
        fvaError={fvaError}
      />
      
      <VehicleHelpText 
        hasAttemptedLookup={hasAttemptedLookup}
        lookupSuccess={lookupSuccess}
        fniLookupSuccess={fniLookupSuccess}
        fvaLookupSuccess={fvaLookupSuccess}
      />
      
      <VehicleDetailsAlerts
        lookupSuccess={lookupSuccess}
        fniLookupSuccess={fniLookupSuccess}
        fvaLookupSuccess={fvaLookupSuccess}
        vehicleDetails={vehicleDetails}
      />
      
      {showFvaDetails && fvaData && <FvaDetailsCard fvaData={fvaData} />}
      
      <VehicleInfoFields
        vehicleBrand={formData.vehicleBrand}
        vehicleModel={formData.vehicleModel}
        vehicleYear={formData.vehicleYear}
        vehicleDescription={formData.vehicleDescription}
        handleInputChange={handleInputChange}
        readOnly={lookupSuccess || fvaLookupSuccess}
      />
      
      <InsuranceInfoFields
        insurancePolicy={formData.insurancePolicy}
        insuranceCompany={formData.insuranceCompany}
        handleInputChange={handleInputChange}
        insuranceLookupSuccess={insuranceLookupSuccess}
        insuranceDetails={insuranceDetails}
        autoInsuranceFound={autoInsuranceFound}
        setInsuranceLookupSuccess={(success) => {}}
        setInsuranceDetails={() => {}}
        setInsuranceInfo={(data: {company: string}) => {}}
      />
    </div>
  );
};

export default VehicleIdentificationStep;
