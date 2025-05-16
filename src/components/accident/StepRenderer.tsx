
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import VehiclesStep from './VehiclesStep';
import WitnessStep from './WitnessStep';
import CircumstancesStep from './CircumstancesStep';
import ReviewStep from './ReviewStep';
import InjuriesStep from './InjuriesStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import SchemeStep from './SchemeStep';
import PhotosStep from './PhotosStep'; // Added import
import { Circumstance, SchemeData } from './types';

interface StepRendererProps {
  currentStepId: string;
  formData: any;
  handleInputChange: (e: any) => void;
  handleOtherVehicleChange: (e: any) => void;
  handlePhotoUpload: (type: string, files: FileList) => void;
  setVehicleInfo: (data: any) => void;
  setOtherVehicleInfo: (data: any) => void;
  setGeolocation: (location: { lat: number; lng: number; address: string }) => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange: (vehicleId: string, circumstanceId: string, checked: boolean) => void;
  setCurrentVehicleId: (id: string) => void;
  currentVehicleId: string;
  setHasInjuries: (hasInjuries: boolean) => void;
  setInjuriesDescription: (description: string) => void;
  setHasWitnesses: (hasWitnesses: boolean) => void;
  updateWitness: (index: number, field: string, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
  onSchemeUpdate?: (schemeData: SchemeData) => void;
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
          formData={formData}
          handleInputChange={handleInputChange}
          setGeolocation={setGeolocation}
        />
      );
    case 'vehicles':
      return (
        <VehiclesStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          handlePhotoUpload={handlePhotoUpload}
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
    case 'photos':  // Add case for photos step
      return (
        <PhotosStep
          vehiclePhotos={formData.vehiclePhotos || []}
          damagePhotos={formData.damagePhotos || []}
          handlePhotoUpload={(type, file) => handlePhotoUpload(type, new FileList([file]))}
        />
      );
    case 'circumstances':
      return (
        <CircumstancesStep
          formData={formData}
          handleCircumstanceChange={(vehicleId, circumstanceId, checked) => 
            handleCircumstanceChange(vehicleId, circumstanceId, checked)
          }
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
          setInsuranceEmails={setInsuranceEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
          setPersonalEmail={setPersonalEmail}
          onEmergencyContacted={onEmergencyContacted}
        />
      );
    default:
      return <div>Étape non reconnue: {currentStepId}</div>;
  }
};

export default StepRenderer;
