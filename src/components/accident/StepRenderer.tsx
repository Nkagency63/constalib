
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import VehiclesStep from './VehiclesStep';
import WitnessStep from './WitnessStep';
import CircumstancesStep from './CircumstancesStep';
import ReviewStep from './ReviewStep';
import InjuriesStep from './InjuriesStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import SchemeStep from './SchemeStep';
import PhotosStep from './PhotosStep';

interface StepRendererProps {
  currentStepId: string;
  formData: any;
  handleInputChange: (e: any) => void;
  handleOtherVehicleChange: (e: any) => void;
  handlePhotoUpload: (type: string, files: File[]) => void;
  setVehicleInfo: (data: any) => void;
  setOtherVehicleInfo: (data: any) => void;
  setGeolocation: (location: { lat: number; lng: number; address: string }) => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange: (vehicleId: "A" | "B", circumstanceId: string, checked: boolean) => void;
  setCurrentVehicleId: (id: "A" | "B") => void;
  currentVehicleId: "A" | "B";
  setHasInjuries: (hasInjuries: boolean) => void;
  setInjuriesDescription: (description: string) => void;
  setHasWitnesses: (hasWitnesses: boolean) => void;
  updateWitness: (index: number, field: string, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
  onSchemeUpdate?: (schemeData: any) => void;
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
  currentVehicleId,
  setHasInjuries,
  setInjuriesDescription,
  setHasWitnesses,
  updateWitness,
  addWitness,
  removeWitness,
  onSchemeUpdate
}) => {
  switch (currentStepId) {
    case 'basics':
      return (
        <BasicInfoStep 
          onDateChange={(date) => handleInputChange({ target: { name: 'accidentDate', value: date }})}
          onTimeChange={(time) => handleInputChange({ target: { name: 'accidentTime', value: time }})}
          onLocationChange={setGeolocation}
          date={formData.accidentDate}
          time={formData.accidentTime}
          location={formData.geolocation}
        />
      );
    case 'vehicles':
      return (
        <VehiclesStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setVehicleInfo={setVehicleInfo}
          setOtherVehicleInfo={setOtherVehicleInfo}
        />
      );
    case 'persons':
      return (
        <DriverAndInsuredStep
          formData={formData}
          handleInputChange={handleInputChange}
        />
      );
    case 'photos':
      return (
        <PhotosStep
          formData={formData}
          handlePhotoUpload={handlePhotoUpload}
        />
      );
    case 'witnesses':
      return (
        <WitnessStep
          formData={formData}
          setHasWitnesses={setHasWitnesses}
          updateWitness={updateWitness}
          addWitness={addWitness}
          removeWitness={removeWitness}
        />
      );
    case 'injuries':
      return (
        <InjuriesStep
          formData={formData}
          setHasInjuries={setHasInjuries}
          setInjuriesDescription={setInjuriesDescription}
        />
      );
    case 'circumstances':
      return (
        <CircumstancesStep
          formData={formData}
          handleCircumstanceChange={handleCircumstanceChange}
          setCurrentVehicleId={setCurrentVehicleId}
          currentVehicleId={currentVehicleId}
        />
      );
    case 'scheme':
      return (
        <SchemeStep
          formData={formData}
          onSchemeUpdate={onSchemeUpdate}
        />
      );
    case 'review':
      return (
        <ReviewStep
          formData={formData}
          onFinalize={() => {}}
        />
      );
    default:
      return <div>Étape non reconnue: {currentStepId}</div>;
  }
};

export default StepRenderer;
