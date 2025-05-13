
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import LocationStep from './LocationStep';
import DetailsStep from './DetailsStep';
import CircumstancesStep from './CircumstancesStep';
import EmailStep from './EmailStep';
import ReviewStep from './ReviewStep';
import SchemeStep from './SchemeStep';
import PhotosStep from './PhotosStep';
import { FormData, SchemeData, WitnessInfo, Circumstance } from './types';
import MultiVehicleStep from './MultiVehicleStep';

interface StepRendererProps {
  currentStepId: string;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: (type: string, files: FileList) => void;
  setVehicleInfo: (info: Partial<FormData>) => void;
  setOtherVehicleInfo: (info: Partial<FormData['otherVehicle']>) => void;
  setGeolocation: (data: { lat: number; lng: number; address: string }) => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange?: (vehicleId: string, circumstance: Circumstance, checked: boolean) => void;
  setCurrentVehicleId?: (id: string) => void;
  setHasInjuries?: (hasInjuries: boolean) => void;
  setInjuriesDescription?: (description: string) => void;
  setHasWitnesses?: (hasWitnesses: boolean) => void;
  updateWitness?: (index: number, field: string, value: string) => void;
  addWitness?: () => void;
  removeWitness?: (index: number) => void;
}

const StepRenderer: React.FC<StepRendererProps> = ({
  currentStepId,
  formData,
  handleInputChange,
  handleOtherVehicleChange,
  handlePhotoUpload,
  setVehicleInfo,
  setOtherVehicleInfo,
  setGeolocation,
  setInsuranceEmails,
  setInvolvedPartyEmails,
  setPersonalEmail,
  onEmergencyContacted,
  handleCircumstanceChange,
  setCurrentVehicleId,
  setHasInjuries,
  setInjuriesDescription,
  setHasWitnesses,
  updateWitness,
  addWitness,
  removeWitness
}) => {
  // Helper function to ensure we have valid circumstance handler
  const safeHandleCircumstanceChange = (vehicleId: string, circumstance: Circumstance, checked: boolean) => {
    if (handleCircumstanceChange) {
      handleCircumstanceChange(vehicleId, circumstance, checked);
    }
  };

  switch (currentStepId) {
    case 'basics':
      return <BasicInfoStep 
        formData={formData} 
        handleInputChange={handleInputChange} 
        onEmergencyContacted={onEmergencyContacted}
      />;
      
    case 'vehicles':
      return (
        <VehicleIdentificationStep
          formData={formData}
          handleInputChange={handleInputChange}
          setVehicleInfo={setVehicleInfo}
        />
      );

    case 'multivehicle':
      return (
        <MultiVehicleStep
          formData={formData}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setOtherVehicleInfo={setOtherVehicleInfo}
        />
      );
      
    case 'drivers':
      return (
        <DriverAndInsuredStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
        />
      );
      
    case 'location':
      return (
        <LocationStep
          formData={formData}
          handleInputChange={handleInputChange}
          setGeolocation={setGeolocation}
        />
      );
      
    case 'details':
      return (
        <DetailsStep
          formData={formData}
          handleInputChange={handleInputChange}
          setHasInjuries={setHasInjuries}
          setInjuriesDescription={setInjuriesDescription}
          setHasWitnesses={setHasWitnesses}
          updateWitness={updateWitness}
          addWitness={addWitness}
          removeWitness={removeWitness}
        />
      );
      
    case 'circumstances':
      return (
        <CircumstancesStep
          formData={formData}
          onCircumstanceChange={safeHandleCircumstanceChange}
          currentVehicleId={setCurrentVehicleId ? formData.currentVehicleId || "A" : "A"}
          setCurrentVehicleId={setCurrentVehicleId}
        />
      );
      
    case 'scheme':
      return (
        <SchemeStep
          formData={formData}
        />
      );

    case 'photos':
      return (
        <PhotosStep
          formData={formData}
          handlePhotoUpload={handlePhotoUpload}
        />
      );

    case 'email':
      return (
        <EmailStep
          formData={formData}
          setInsuranceEmails={setInsuranceEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
          setPersonalEmail={setPersonalEmail}
        />
      );
      
    case 'review':
      return (
        <ReviewStep
          formData={formData}
        />
      );

    default:
      return <div>Étape non reconnue</div>;
  }
};

export default StepRenderer;
