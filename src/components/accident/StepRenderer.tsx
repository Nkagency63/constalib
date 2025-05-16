
import React, { useState } from 'react';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import CircumstancesStep from './CircumstancesStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import InjuriesStep from './InjuriesStep';
import PhotosStep from './PhotosStep';
import ReviewStep from './ReviewStep';
import VehiclesStep from './VehiclesStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import WitnessStep from './WitnessStep';
import SchemeStep from './SchemeStep';

interface StepRendererProps {
  currentStepId: string;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload: (type: string, files: FileList) => void;
  setVehicleInfo: (data: any) => void;
  setOtherVehicleInfo: (data: any) => void;
  setGeolocation: (location: { lat: number; lng: number; address: string }) => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange: (vehicleId: "A" | "B", circumstanceId: string, checked: boolean) => void;
  setCurrentVehicleId: (id: string) => void;
  currentVehicleId: "A" | "B";
  setHasInjuries: (hasInjuries: boolean) => void;
  setInjuriesDescription: (description: string) => void;
  setHasWitnesses: (hasWitnesses: boolean) => void;
  updateWitness: (index: number, field: string, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
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
  removeWitness
}) => {
  // Render the appropriate step based on the current step ID
  switch (currentStepId) {
    case 'basics':
      return (
        <BasicInfoStep
          formData={formData}
          handleInputChange={handleInputChange}
          date={formData.accidentDate}
          time={formData.accidentTime}
          location={formData.location}
        />
      );
      
    case 'location':
      return (
        <LocationStep
          formData={formData}
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
      
    case 'drivers':
      return (
        <DriverAndInsuredStep
          formData={formData}
          handleInputChange={handleInputChange}
        />
      );
      
    case 'circumstances':
      return (
        <CircumstancesStep
          formData={formData}
          vehicleId={currentVehicleId}
          setVehicleId={setCurrentVehicleId}
          handleCircumstanceChange={handleCircumstanceChange}
        />
      );
      
    case 'injuries':
      return (
        <InjuriesStep
          formData={formData}
          handleInputChange={handleInputChange}
          setHasInjuries={setHasInjuries}
          setInjuriesDescription={setInjuriesDescription}
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
      
    case 'scheme':
      return (
        <SchemeStep
          formData={formData}
          onSchemeUpdate={(schemeData) => {
            // Handle scheme data update if needed
            console.log('Scheme updated:', schemeData);
          }}
        />
      );
      
    case 'photos':
      return (
        <PhotosStep
          formData={formData}
          handlePhotoUpload={(type, file) => {
            if (file) {
              handlePhotoUpload(type, file);
            }
          }}
        />
      );
      
    case 'review':
      return (
        <ReviewStep
          formData={formData}
          setInsuranceEmails={setInsuranceEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
          setPersonalEmail={setPersonalEmail}
        />
      );
      
    default:
      return <div>Section non trouvée.</div>;
  }
};

export default StepRenderer;
