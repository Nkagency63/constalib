
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
import CircumstancesStep from './CircumstancesStep';
import SignatureStep from './SignatureStep';
import OwnerDriverStep from './OwnerDriverStep';

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
  // Nouvelles fonctions
  addWitness: () => void;
  updateWitness: (id: string, field: 'name' | 'contact', value: string) => void;
  removeWitness: (id: string) => void;
  handleOwnerDriverChange: (e: React.ChangeEvent<HTMLInputElement>, isOtherVehicle?: boolean) => void;
  toggleCircumstance: (index: number, party: 'A' | 'B') => void;
  setSignature: (signature: string, party: 'A' | 'B') => void;
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
  // Nouvelles fonctions
  addWitness,
  updateWitness,
  removeWitness,
  handleOwnerDriverChange,
  toggleCircumstance,
  setSignature
}: StepRendererProps) => {

  // Fonction pour gérer les changements de conditions météo
  const onWeatherChange = (value: string) => {
    const syntheticEvent = {
      target: {
        name: 'weatherConditions',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };

  // Fonction pour gérer les changements de blessés
  const onInjuredPersonsChange = (value: boolean) => {
    const syntheticEvent = {
      target: {
        name: 'injuredPersons',
        value: value.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };

  switch (currentStepId) {
    case 'basics':
      return (
        <BasicInfoStep 
          date={formData.date}
          time={formData.time}
          weatherConditions={formData.weatherConditions}
          injuredPersons={formData.injuredPersons}
          witnesses={formData.witnesses}
          handleInputChange={handleInputChange}
          onWeatherChange={onWeatherChange}
          onInjuredPersonsChange={onInjuredPersonsChange}
          addWitness={addWitness}
          updateWitness={updateWitness}
          removeWitness={removeWitness}
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
    
    case 'owner-driver':
      return (
        <OwnerDriverStep
          formData={formData}
          handleOwnerDriverChange={handleOwnerDriverChange}
        />
      );
      
    case 'circumstances':
      return (
        <CircumstancesStep
          circumstancesA={formData.circumstancesA}
          circumstancesB={formData.circumstancesB}
          observations={formData.observations}
          disagreement={formData.disagreement}
          toggleCircumstance={toggleCircumstance}
          handleInputChange={handleInputChange}
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
        <SchemeStep formData={formData} />
      );
      
    case 'signature':
      return (
        <SignatureStep
          signatureA={formData.signatureA}
          signatureB={formData.signatureB}
          signatureDateA={formData.signatureDateA}
          signatureDateB={formData.signatureDateB}
          setSignature={setSignature}
        />
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
