
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import MultiVehicleStep from './MultiVehicleStep';
import DetailsStep from './DetailsStep';
import PhotosStep from './PhotosStep';
import EmailStep from './EmailStep';
import ReviewStep from './ReviewStep';
import CircumstancesStep from './CircumstancesStep';
import SchemeStep from './SchemeStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import { FormData } from './types';

interface StepRendererProps {
  currentStepId: string;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload?: (type: 'vehicle' | 'damage', files: FileList) => void;
  setVehicleInfo?: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo?: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setGeolocation?: (lat: number, lng: number, address: string) => void;
  setInsuranceEmails?: (emails: string[]) => void;
  setInvolvedPartyEmails?: (emails: string[]) => void;
  setPersonalEmail?: (email: string) => void;
  onEmergencyContacted?: () => void;
  handleCircumstanceChange?: (vehicleId: 'A' | 'B', circumstanceId: string, isChecked: boolean) => void;
  setCurrentVehicleId?: (vehicleId: 'A' | 'B') => void;
  setHasInjuries?: (value: boolean) => void;
  setInjuriesDescription?: (description: string) => void;
  setHasWitnesses?: (value: boolean) => void;
  updateWitness?: (index: number, field: keyof any, value: string) => void;
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
  switch (currentStepId) {
    case 'basics':
      return (
        <BasicInfoStep 
          handleInputChange={handleInputChange} 
          setGeolocation={setGeolocation || (() => {})}
          date={formData.date}
          time={formData.time}
          location={formData.location}
        />
      );

    case 'vehicles':
      return (
        <MultiVehicleStep 
          vehicleData={{
            licensePlate: formData.licensePlate,
            brand: formData.vehicleBrand,
            model: formData.vehicleModel,
            year: formData.vehicleYear,
            description: formData.vehicleDescription || '',
            firstRegistration: formData.firstRegistration,
            insurancePolicy: formData.insurancePolicy,
            insuranceCompany: formData.insuranceCompany
          }}
          otherVehicleData={formData.otherVehicle}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange || (() => {})}
          setVehicleInfo={setVehicleInfo || (() => {})}
          setOtherVehicleInfo={setOtherVehicleInfo || (() => {})}
          onEmergencyContacted={onEmergencyContacted || (() => {})}
          vehicleId={formData.currentVehicleId || 'A'}
          setVehicleId={setCurrentVehicleId || (() => {})}
          emergencyContacted={formData.emergencyContacted || false}
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
          vehiclePhotos={formData.vehiclePhotos}
          damagePhotos={formData.damagePhotos}
          handlePhotoUpload={(type, file) => {
            if (handlePhotoUpload) {
              const fileList = new DataTransfer();
              fileList.items.add(file);
              handlePhotoUpload(type === 'vehiclePhotos' ? 'vehicle' : 'damage', fileList.files);
            }
          }}
        />
      );

    case 'scheme':
      return (
        <SchemeStep />
      );

    case 'circumstances':
      return (
        <CircumstancesStep 
          vehicleACircumstances={formData.vehicleACircumstances}
          vehicleBCircumstances={formData.vehicleBCircumstances}
          handleCircumstanceChange={handleCircumstanceChange || (() => {})}
          vehicleAInfo={{ brand: formData.vehicleBrand, model: formData.vehicleModel }}
          vehicleBInfo={{ brand: formData.otherVehicle.brand, model: formData.otherVehicle.model }}
        />
      );

    case 'details':
      return (
        <DetailsStep 
          hasInjuries={formData.hasInjuries}
          injuriesDescription={formData.injuriesDescription || ''}
          hasWitnesses={formData.hasWitnesses}
          witnesses={formData.witnesses}
          handleInputChange={handleInputChange}
          setHasInjuries={setHasInjuries || (() => {})}
          setInjuriesDescription={setInjuriesDescription || (() => {})}
          setHasWitnesses={setHasWitnesses || (() => {})}
          updateWitness={updateWitness || (() => {})}
          addWitness={addWitness || (() => {})}
          removeWitness={removeWitness || (() => {})}
        />
      );

    case 'emails':
      return (
        <EmailStep 
          personalEmail={formData.personalEmail}
          insuranceEmails={formData.insuranceEmails}
          involvedPartyEmails={formData.involvedPartyEmails}
          setPersonalEmail={setPersonalEmail || (() => {})}
          setInsuranceEmails={setInsuranceEmails || (() => {})}
          setInvolvedPartyEmails={setInvolvedPartyEmails || (() => {})}
        />
      );

    case 'review':
      return <ReviewStep formData={formData} />;

    default:
      return <div>Étape inconnue</div>;
  }
};

export default StepRenderer;
