import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import DetailsStep from './DetailsStep';
import PhotosStep from './PhotosStep';
import EmailStep from './EmailStep';
import ReviewStep from './ReviewStep';
import SchemeStep from './SchemeStep';
import { FormData } from './types';

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
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const StepRenderer = ({
  currentStepId,
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleOtherVehicleChange,
  handlePhotoUpload,
  setVehicleInfo,
  setOtherVehicleInfo,
  setGeolocation,
  setInsuranceEmails,
  setInvolvedPartyEmails,
  setPersonalEmail,
  onEmergencyContacted
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
        <VehicleIdentificationStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setVehicleInfo={setVehicleInfo}
          setOtherVehicleInfo={setOtherVehicleInfo}
          onEmergencyContacted={onEmergencyContacted}
        />
      );
    case 'details':
      return (
        <DetailsStep
          description={formData.description}
          hasInjuries={formData.hasInjuries}
          hasWitnesses={formData.hasWitnesses}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      );
    case 'photos':
      return (
        <PhotosStep
          vehiclePhotos={formData.vehiclePhotos}
          damagePhotos={formData.damagePhotos}
          handlePhotoUpload={handlePhotoUpload}
        />
      );
    case 'scheme':
      return <SchemeStep formData={formData} />;
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
