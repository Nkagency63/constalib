import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import MultiVehicleStep from './MultiVehicleStep';
import DetailsStep from './DetailsStep';
import CircumstancesStep from './CircumstancesStep';
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
  handleCircumstanceChange: (vehicleId: 'A' | 'B', circumstanceId: string, isChecked: boolean) => void;
  setCurrentVehicleId: (vehicleId: 'A' | 'B') => void;
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
  setCurrentVehicleId
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
    case 'details':
      return (
        <DetailsStep
          description={formData.description}
          handleInputChange={handleInputChange}
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
