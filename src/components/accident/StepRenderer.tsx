
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import VehicleIdentificationStep from './VehicleIdentificationStep';
import DriverAndInsuredStep from './DriverAndInsuredStep';
import LocationStep from './LocationStep';
import DetailsStep from './DetailsStep';
import CircumstancesStep from './CircumstancesStep';
import EmailStep from './EmailStep';
import ReviewStep from './ReviewStep';
import SchemeStep from './SchemeStep';
import PhotosStep from './PhotosStep';
import { FormData, SchemeData, WitnessInfo, Circumstance } from './types';
import MultiVehicleStep from './MultiVehicleStep';

interface StepRendererProps {
  currentStepId: string;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: (type: string, files: FileList) => void;
  setVehicleInfo: (info: Partial<FormData>) => void;
  setOtherVehicleInfo: (info: Partial<FormData['otherVehicle']>) => void;
  setGeolocation: (data: { lat: number; lng: number; address: string }) => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange?: (vehicleId: string, circumstance: Circumstance, checked: boolean) => void;
  setCurrentVehicleId?: (id: string) => void;
  currentVehicleId?: string;
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
  currentVehicleId,
  setHasInjuries,
  setInjuriesDescription,
  setHasWitnesses,
  updateWitness,
  addWitness,
  removeWitness
}) => {
  // Helper function to ensure we have valid circumstance handler
  const safeHandleCircumstanceChange = (vehicleId: string, circumstance: Circumstance, checked: boolean) => {
    if (handleCircumstanceChange) {
      handleCircumstanceChange(vehicleId, circumstance, checked);
    }
  };

  switch (currentStepId) {
    case 'basics':
      return <BasicInfoStep 
        date={formData.date}
        time={formData.time}
        location={formData.location}
        hasMaterialDamage={formData.hasMaterialDamage}
        materialDamageDescription={formData.materialDamageDescription}
        handleInputChange={handleInputChange}
        onEmergencyContacted={onEmergencyContacted}
      />;
      
    case 'vehicles':
      return (
        <VehicleIdentificationStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setVehicleInfo={(data) => setVehicleInfo({
            vehicleBrand: data.brand,
            vehicleModel: data.model,
            vehicleYear: data.year,
          })}
          setOtherVehicleInfo={setOtherVehicleInfo}
          onEmergencyContacted={onEmergencyContacted}
          vehicleId="A"
        />
      );

    case 'multivehicle':
      return (
        <MultiVehicleStep
          otherVehicle={formData.otherVehicle}
          handleOtherVehicleChange={handleOtherVehicleChange}
          setOtherVehicleInfo={setOtherVehicleInfo}
        />
      );
      
    case 'drivers':
      return (
        <DriverAndInsuredStep
          driverName={formData.driverName}
          driverAddress={formData.driverAddress}
          driverPhone={formData.driverPhone}
          driverLicense={formData.driverLicense}
          insuredName={formData.insuredName}
          insuredAddress={formData.insuredAddress}
          insuredPhone={formData.insuredPhone}
          otherDriverName={formData.otherDriverName}
          otherDriverAddress={formData.otherDriverAddress}
          otherDriverPhone={formData.otherDriverPhone}
          otherDriverLicense={formData.otherDriverLicense}
          otherInsuredName={formData.otherInsuredName}
          otherInsuredAddress={formData.otherInsuredAddress}
          otherInsuredPhone={formData.otherInsuredPhone}
          handleInputChange={handleInputChange}
        />
      );
      
    case 'location':
      return (
        <LocationStep
          location={formData.location}
          geolocation={formData.geolocation}
          handleInputChange={handleInputChange}
          setGeolocation={setGeolocation}
        />
      );
      
    case 'details':
      return (
        <DetailsStep
          hasInjuries={formData.hasInjuries}
          injuriesDescription={formData.injuriesDescription}
          hasWitnesses={formData.hasWitnesses}
          witnesses={formData.witnesses || []}
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
          vehicleACircumstances={formData.vehicleACircumstances || []}
          vehicleBCircumstances={formData.vehicleBCircumstances || []}
          handleCircumstanceChange={safeHandleCircumstanceChange}
          currentVehicleId={currentVehicleId || "A"}
          setCurrentVehicleId={setCurrentVehicleId}
        />
      );
      
    case 'scheme':
      return (
        <SchemeStep
          formData={formData}
          handleSchemeData={(schemeData) => console.log('Scheme data saved:', schemeData)}
        />
      );

    case 'photos':
      return (
        <PhotosStep
          vehiclePhotos={formData.vehiclePhotos || []}
          damagePhotos={formData.damagePhotos || []}
          handlePhotoUpload={(type, files) => {
            if (files.length > 0) {
              handlePhotoUpload(type, files);
            }
          }}
        />
      );

    case 'email':
      return (
        <EmailStep
          personalEmail={formData.personalEmail || ''}
          insuranceEmails={formData.insuranceEmails || []}
          involvedPartyEmails={formData.involvedPartyEmails || []}
          setPersonalEmail={setPersonalEmail}
          setInsuranceEmails={setInsuranceEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
        />
      );
      
    case 'review':
      return (
        <ReviewStep
          formData={formData}
        />
      );

    default:
      return <div>Étape non reconnue</div>;
  }
};

export default StepRenderer;
