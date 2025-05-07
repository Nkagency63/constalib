
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import MultiVehicleStep from './MultiVehicleStep';
import CircumstancesStep from './CircumstancesStep';
import DetailsStep from './DetailsStep';
import EmailStep from './EmailStep';
import PhotosStep from './PhotosStep';
import ReviewStep from './ReviewStep';
import SchemeStep from './SchemeStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';

interface StepRendererProps {
  currentStepId: string;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload?: (type: string, file: FileList) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setGeolocation?: (data: {lat: number, lng: number, address: string}) => void;
  setInsuranceEmails?: (emails: string[]) => void;
  setInvolvedPartyEmails?: (emails: string[]) => void;
  setPersonalEmail?: (email: string) => void;
  onEmergencyContacted?: () => void;
  handleCircumstanceChange?: (vehicleId: 'A' | 'B', circumstanceId: string, checked: boolean) => void;
  setCurrentVehicleId?: (id: 'A' | 'B') => void;
  setHasInjuries?: (hasInjuries: boolean) => void;
  setInjuriesDescription?: (description: string) => void;
  setHasWitnesses?: (hasWitnesses: boolean) => void;
  updateWitness?: (index: number, field: string, value: string) => void;
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
        <LocationStep
          date={formData.date || ''}
          time={formData.time || ''}
          location={formData.location || ''}
          geolocation={formData.geolocation}
          handleInputChange={handleInputChange}
          setGeolocation={(data) => setGeolocation && setGeolocation(data)}
        />
      );

    case 'vehicles':
      return (
        <MultiVehicleStep 
          licensePlate={formData.licensePlate}
          vehicleBrand={formData.vehicleBrand}
          vehicleModel={formData.vehicleModel}
          vehicleYear={formData.vehicleYear}
          vehicleDescription={formData.vehicleDescription || ''}
          firstRegistration={formData.firstRegistration}
          insurancePolicy={formData.insurancePolicy}
          insuranceCompany={formData.insuranceCompany}
          otherVehicle={formData.otherVehicle}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setVehicleInfo={setVehicleInfo}
          setOtherVehicleInfo={setOtherVehicleInfo}
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
          vehiclePhotos={formData.vehiclePhotos || []}
          damagePhotos={formData.damagePhotos || []}
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
        <SchemeStep 
          formData={formData}
        />
      );

    case 'circumstances':
      return (
        <CircumstancesStep 
          vehicleACircumstances={formData.vehicleACircumstances || []}
          vehicleBCircumstances={formData.vehicleBCircumstances || []}
          handleCircumstanceChange={handleCircumstanceChange || (() => {})}
          currentVehicleId={formData.currentVehicleId || 'A'} 
          setCurrentVehicleId={setCurrentVehicleId || (() => {})}
          circumstances={[]} // Ajouter le prop requis, même s'il n'est pas utilisé
        />
      );

    case 'details':
      return (
        <DetailsStep 
          description={formData.description || ''}
          hasInjuries={formData.hasInjuries}
          injuriesDescription={formData.injuriesDescription || ''}
          hasWitnesses={formData.hasWitnesses}
          witnesses={formData.witnesses || []}
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
          personalEmail={formData.personalEmail || ''}
          insuranceEmails={formData.insuranceEmails || []}
          involvedPartyEmails={formData.involvedPartyEmails || []}
          setPersonalEmail={setPersonalEmail || (() => {})}
          setInsuranceEmails={setInsuranceEmails || (() => {})}
          setInvolvedPartyEmails={setInvolvedPartyEmails || (() => {})}
        />
      );

    case 'review':
      return <ReviewStep formData={formData} />;

    default:
      return <div>Step not found</div>;
  }
};

export default StepRenderer;
