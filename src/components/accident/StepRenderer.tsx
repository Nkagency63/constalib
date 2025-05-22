
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import MultiVehicleStep from './MultiVehicleStep';
import DriversInsuredStep from './DriversInsuredStep';
import DetailsStep from './DetailsStep';
import CircumstancesStep from './CircumstancesStep';
import PhotosStep from './PhotosStep';
import EmailStep from './EmailStep';
import ReviewStep from './ReviewStep';
import SchemeStep from './SchemeStep';
import { FormData, WitnessInfo, DriverInfo, InsuredInfo } from './types';

interface StepRendererProps {
  currentStepId: string;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload: (type: 'vehiclePhotos' | 'damagePhotos', file: File) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setGeolocation: (data: {lat: number, lng: number, address: string}) => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange: (vehicleId: 'A' | 'B', circumstanceId: string, isChecked: boolean) => void;
  setCurrentVehicleId: (vehicleId: 'A' | 'B') => void;
  setHasInjuries: (value: boolean) => void;
  setInjuriesDescription: (value: string) => void;
  setHasWitnesses: (value: boolean) => void;
  updateWitness: (index: number, field: keyof WitnessInfo, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
  updateDriverA?: (field: keyof DriverInfo, value: string) => void;
  updateDriverB?: (field: keyof DriverInfo, value: string) => void;
  updateInsuredA?: (field: keyof InsuredInfo, value: string | boolean) => void;
  updateInsuredB?: (field: keyof InsuredInfo, value: string | boolean) => void;
}

const StepRenderer = ({
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
  removeWitness,
  updateDriverA,
  updateDriverB,
  updateInsuredA,
  updateInsuredB
}: StepRendererProps) => {
  switch (currentStepId) {
    case 'basics':
      return (
        <BasicInfoStep 
          date={formData.date} 
          time={formData.time} 
          handleInputChange={handleInputChange}
        />
      );
    case 'location':
      return (
        <LocationStep 
          location={formData.location}
          handleInputChange={handleInputChange}
          setGeolocation={setGeolocation}
        />
      );
    case 'vehicles':
      return (
        <MultiVehicleStep 
          formData={formData}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setVehicleInfo={setVehicleInfo}
          setOtherVehicleInfo={setOtherVehicleInfo}
          onEmergencyContacted={onEmergencyContacted}
        />
      );
    case 'drivers':
      return (
        updateDriverA && updateDriverB && updateInsuredA && updateInsuredB ? (
          <DriversInsuredStep
            driverA={formData.driverA}
            driverB={formData.driverB}
            insuredA={formData.insuredA}
            insuredB={formData.insuredB}
            updateDriverA={updateDriverA}
            updateDriverB={updateDriverB}
            updateInsuredA={updateInsuredA}
            updateInsuredB={updateInsuredB}
          />
        ) : null
      );
    case 'details':
      return (
        <DetailsStep
          description={formData.description}
          hasInjuries={formData.hasInjuries}
          injuriesDescription={formData.injuriesDescription}
          hasWitnesses={formData.hasWitnesses}
          witnesses={formData.witnesses}
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
          circumstances={[]}
          vehicleACircumstances={formData.vehicleACircumstances}
          vehicleBCircumstances={formData.vehicleBCircumstances}
          handleCircumstanceChange={handleCircumstanceChange}
          currentVehicleId={formData.currentVehicleId || 'A'}
          setCurrentVehicleId={setCurrentVehicleId}
        />
      );
    case 'scheme':
      return <SchemeStep formData={formData} />;
    case 'photos':
      return (
        <PhotosStep
          vehiclePhotos={formData.vehiclePhotos}
          damagePhotos={formData.damagePhotos}
          handlePhotoUpload={handlePhotoUpload}
        />
      );
    case 'email':
      return (
        <EmailStep
          personalEmail={formData.personalEmail}
          insuranceEmails={formData.insuranceEmails}
          involvedPartyEmails={formData.involvedPartyEmails}
          setPersonalEmail={setPersonalEmail}
          setInsuranceEmails={setInsuranceEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
        />
      );
    case 'review':
      return <ReviewStep formData={formData} />;
    default:
      return <div>Étape non trouvée</div>;
  }
};

export default StepRenderer;
