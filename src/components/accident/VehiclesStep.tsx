
import React, { useState } from 'react';
import MultiVehicleStep from './MultiVehicleStep';

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
    />
  );
};

export default VehiclesStep;
