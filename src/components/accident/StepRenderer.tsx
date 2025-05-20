
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import CircumstancesStep from './CircumstancesStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import InjuriesStep from './InjuriesStep';
import PhotosStep from './PhotosStep';
import ReviewStep from './ReviewStep';
import VehiclesStep from './VehiclesStep';
import WitnessStep from './WitnessStep';
import SchemeStep from './SchemeStep';
import { WitnessInfo, SchemeData, GeolocationData } from './types';

interface StepRendererProps {
  currentStepId: string;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload: (type: string, files: FileList) => void;
  setVehicleInfo: (data: any) => void;
  setOtherVehicleInfo: (data: any) => void;
  setGeolocation: (location: GeolocationData) => void;
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
  onSchemeUpdate?: (schemeData: SchemeData) => void;
  clearGeolocation?: () => void;
  onFormSubmitted?: () => void;
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
  onSchemeUpdate,
  clearGeolocation,
  onFormSubmitted
}) => {
  // Render the appropriate step based on the current step ID
  switch (currentStepId) {
    case 'basics':
      return (
        <BasicInfoStep
          date={formData.accidentDate}
          time={formData.accidentTime}
          location={formData.location}
          hasMaterialDamage={formData.hasMaterialDamage}
          materialDamageDescription={formData.materialDamageDescription}
          handleInputChange={handleInputChange}
          onEmergencyContacted={onEmergencyContacted}
          geolocation={formData.geolocation || { lat: null, lng: null, address: '' }}
          setGeolocation={setGeolocation}
          clearGeolocation={clearGeolocation}
        />
      );
      
    case 'location':
      return (
        <LocationStep
          date={formData.accidentDate}
          time={formData.accidentTime}
          location={formData.location}
          description={formData.description}
          geolocation={formData.geolocation || { lat: null, lng: null, address: '' }}
          handleInputChange={handleInputChange}
          setGeolocation={setGeolocation}
          clearGeolocation={clearGeolocation}
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
          currentVehicleId={currentVehicleId}
          setCurrentVehicleId={setCurrentVehicleId as (id: "A" | "B") => void}
          handleCircumstanceChange={handleCircumstanceChange}
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
      
    case 'witnesses':
      return (
        <WitnessStep
          formData={formData}
          setHasWitnesses={setHasWitnesses}
          updateWitness={updateWitness as (index: number, field: keyof WitnessInfo, value: string) => void}
          addWitness={addWitness}
          removeWitness={removeWitness}
        />
      );
      
    case 'scheme':
      return (
        <SchemeStep
          formData={formData}
          onSchemeUpdate={onSchemeUpdate}
        />
      );
      
    case 'photos':
      return (
        <PhotosStep
          handlePhotoUpload={(type, files) => {
            if (files && files.length > 0) {
              handlePhotoUpload(type, files);
            }
          }}
        />
      );
      
    case 'review':
      return (
        <ReviewStep
          formData={formData}
          onSubmitSuccess={onFormSubmitted || (() => {})}
        />
      );
      
    default:
      return <div>Section non trouvée.</div>;
  }
};

export default StepRenderer;
