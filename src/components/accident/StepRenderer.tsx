
// Dans StepRenderer.tsx, modifiez la partie qui renvoie le composant ReviewStep
// pour passer la propriété onSubmitSuccess

// Importez correctement les types et composants nécessaires en haut du fichier
import { useState } from 'react';
import BasicInfoStep from './BasicInfoStep';
import VehiclesStep from './VehiclesStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import LocationStep from './LocationStep';
import PhotosStep from './PhotosStep';
import CircumstancesStep from './CircumstancesStep';
import WitnessStep from './WitnessStep';
import InjuriesStep from './InjuriesStep';
import EmailStep from './EmailStep';
import SchemeStep from './SchemeStep';
import ReviewStep from './ReviewStep';
import { GeolocationData } from './types';

interface StepRendererProps {
  currentStepId: string;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload: (type: string, files: File[]) => void;
  setVehicleInfo: (data: any) => void;
  setOtherVehicleInfo: (data: any) => void;
  setGeolocation: (location: GeolocationData) => void;
  clearGeolocation: () => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange: (vehicleId: 'A' | 'B', circumstanceId: string) => void;
  setCurrentVehicleId: (id: string) => void;
  currentVehicleId: string;
  setHasInjuries: (hasInjuries: boolean) => void;
  setInjuriesDescription: (description: string) => void;
  setHasWitnesses: (hasWitnesses: boolean) => void;
  updateWitness: (index: number, field: string, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
  onSchemeUpdate: (schemeData: any) => void;
  onFormSubmitted: () => void;
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
  clearGeolocation,
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
  onFormSubmitted
}) => {
  
  switch (currentStepId) {
    case "basics":
      return (
        <BasicInfoStep
          date={formData.date}
          time={formData.time}
          location={formData.location}
          hasMaterialDamage={formData.hasMaterialDamage}
          materialDamageDescription={formData.materialDamageDescription}
          geolocation={formData.geolocation}
          handleInputChange={handleInputChange}
          onEmergencyContacted={onEmergencyContacted}
          setGeolocation={setGeolocation}
          clearGeolocation={clearGeolocation}
        />
      );
    case "vehicles":
      return (
        <VehiclesStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setVehicleInfo={setVehicleInfo}
          setOtherVehicleInfo={setOtherVehicleInfo}
          handlePhotoUpload={(type, files) => {
            if (files.length > 0) {
              handlePhotoUpload(type, files);
            }
          }}
        />
      );
    case "drivers":
      return (
        <DriverAndInsuredStep
          formData={formData}
          handleInputChange={handleInputChange}
        />
      );
    case "location":
      return (
        <LocationStep
          date={formData.date}
          time={formData.time}
          location={formData.location}
          description={formData.description}
          geolocation={formData.geolocation}
          handleInputChange={handleInputChange}
          setGeolocation={setGeolocation}
          clearGeolocation={clearGeolocation}
        />
      );
    case "photos":
      return (
        <PhotosStep
          formData={formData}
          handlePhotoUpload={(type, files) => {
            if (files.length > 0) {
              handlePhotoUpload(type, files);
            }
          }}
        />
      );
    case "circumstances":
      return (
        <CircumstancesStep
          formData={formData}
          handleCircumstanceChange={handleCircumstanceChange}
          setCurrentVehicleId={(id) => setCurrentVehicleId(id as 'A' | 'B')}
          currentVehicleId={currentVehicleId as 'A' | 'B'}
        />
      );
    case "witnesses":
      return (
        <WitnessStep
          formData={formData}
          setHasWitnesses={setHasWitnesses}
          updateWitness={updateWitness}
          addWitness={addWitness}
          removeWitness={removeWitness}
        />
      );
    case "injuries":
      return (
        <InjuriesStep
          formData={formData}
          setHasInjuries={setHasInjuries}
          setInjuriesDescription={setInjuriesDescription}
        />
      );
    case "emails":
      return (
        <EmailStep
          personalEmail={formData.personalEmail}
          insuranceEmails={formData.insuranceEmails}
          involvedPartyEmails={formData.involvedPartyEmails}
          setInsuranceEmails={setInsuranceEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
          setPersonalEmail={setPersonalEmail}
        />
      );
    case "scheme":
      return (
        <SchemeStep
          formData={formData}
          onSchemeUpdate={onSchemeUpdate}
        />
      );
    
    case "review":
      return (
        <ReviewStep 
          formData={formData} 
          onSubmitSuccess={onFormSubmitted}
        />
      );
    
    default:
      return (
        <div>
          <h2>Étape inconnue</h2>
          <p>Veuillez contacter l'assistance.</p>
        </div>
      );
  }
};

export default StepRenderer;
