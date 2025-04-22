
import { FormData } from './types';
import BasicInfoStep from './BasicInfoStep';
import DetailsStep from './DetailsStep';
import PhotosStep from './PhotosStep';
import SchemeStep from './SchemeStep';
import ReviewStep from './ReviewStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import LocationStep from './LocationStep';
import MultiVehicleStep from './MultiVehicleStep';
import EmailStep from './EmailStep';

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
  onEmergencyContacted?: () => void;
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
        <MultiVehicleStep
          licensePlate={formData.licensePlate}
          vehicleBrand={formData.vehicleBrand}
          vehicleModel={formData.vehicleModel}
          vehicleYear={formData.vehicleYear}
          vehicleDescription={formData.vehicleDescription}
          insurancePolicy={formData.insurancePolicy}
          insuranceCompany={formData.insuranceCompany}
          otherVehicle={formData.otherVehicle}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setVehicleInfo={setVehicleInfo}
          setOtherVehicleInfo={setOtherVehicleInfo}
        />
      );
      
    case 'details':
      return (
        <DetailsStep
          description={formData.description}
          handleInputChange={handleInputChange}
        />
      );
      
    case 'photos':
      return (
        <PhotosStep handlePhotoUpload={handlePhotoUpload} />
      );
      
    case 'scheme':
      return (
        <SchemeStep geolocation={formData.geolocation} />
      );
      
    case 'email':
      return (
        <EmailStep
          insuranceEmails={formData.insuranceEmails}
          setInsuranceEmails={setInsuranceEmails}
          involvedPartyEmails={formData.involvedPartyEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
          personalEmail={formData.personalEmail}
          setPersonalEmail={setPersonalEmail}
        />
      );
      
    case 'review':
      return (
        <ReviewStep formData={formData} />
      );
      
    default:
      return null;
  }
};

export default StepRenderer;
