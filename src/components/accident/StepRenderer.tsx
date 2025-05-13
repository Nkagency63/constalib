
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
  setVehicleInfo: (data: { brand: string, model: string, year?: string, firstRegistration?: string }) => void;
  setOtherVehicleInfo: (info: Partial<FormData['otherVehicle']>) => void;
  setGeolocation: (data: { lat: number; lng: number; address: string }) => void;
  setInsuranceEmails: (emails: string[]) => void;
  setInvolvedPartyEmails: (emails: string[]) => void;
  setPersonalEmail: (email: string) => void;
  onEmergencyContacted: () => void;
  handleCircumstanceChange?: (vehicleId: "A" | "B", circumstance: Circumstance, checked: boolean) => void;
  setCurrentVehicleId?: (id: string) => void;
  currentVehicleId?: string;
  setHasInjuries?: (hasInjuries: boolean) => void;
  setInjuriesDescription?: (description: string) => void;
  setHasWitnesses?: (hasWitnesses: boolean) => void;
  updateWitness?: (index: number, field: keyof WitnessInfo, value: string) => void;
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
  const safeHandleCircumstanceChange = (vehicleId: "A" | "B", circumstance: Circumstance, checked: boolean = true) => {
    if (handleCircumstanceChange) {
      handleCircumstanceChange(vehicleId, circumstance, checked);
    }
  };

  switch (currentStepId) {
    case 'basics':
      return (
        <BasicInfoStep 
          date={formData.date}
          time={formData.time}
          location={formData.location}
          handleInputChange={handleInputChange}
          onEmergencyContacted={onEmergencyContacted}
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
          driver={{
            name: formData.driverName || '',
            address: formData.driverAddress || '',
            phone: formData.driverPhone || '',
            license: formData.driverLicense || ''
          }}
          insured={{
            name: formData.insuredName || '',
            address: formData.insuredAddress || '',
            phone: formData.insuredPhone || ''
          }}
          otherDriver={{
            name: formData.otherDriverName || '',
            address: formData.otherDriverAddress || '',
            phone: formData.otherDriverPhone || '',
            license: formData.otherDriverLicense || ''
          }}
          otherInsured={{
            name: formData.otherInsuredName || '',
            address: formData.otherInsuredAddress || '',
            phone: formData.otherInsuredPhone || ''
          }}
          handleInputChange={handleInputChange}
        />
      );
      
    case 'location':
      return (
        <LocationStep
          date={formData.date}
          time={formData.time}
          location={formData.location}
          geolocation={formData.geolocation}
          handleInputChange={handleInputChange}
          setGeolocation={setGeolocation}
        />
      );
      
    case 'details':
      return (
        <DetailsStep
          hasInjuries={formData.hasInjuries || false}
          injuriesDescription={formData.injuriesDescription || ''}
          hasWitnesses={formData.hasWitnesses || false}
          witnesses={formData.witnesses || []}
          description={formData.description || ''}
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
          handleCircumstanceChange={handleCircumstanceChange}
          currentVehicleId={currentVehicleId || "A"}
          setCurrentVehicleId={setCurrentVehicleId}
        />
      );
      
    case 'scheme':
      return (
        <SchemeStep
          formData={formData}
          onSchemeUpdate={(schemeData: SchemeData) => console.log('Scheme data saved:', schemeData)}
        />
      );

    case 'photos':
      return (
        <PhotosStep
          vehiclePhotos={(formData.vehiclePhotos || []) as File[]}
          damagePhotos={(formData.damagePhotos || []) as File[]}
          handlePhotoUpload={(type: 'vehiclePhotos' | 'damagePhotos', file: File) => {
            // Create a mock FileList with a single file
            const fileList = {
              0: file,
              length: 1,
              item: (index: number) => index === 0 ? file : null,
              [Symbol.iterator]: function* () {
                yield file;
              }
            } as unknown as FileList;
            
            handlePhotoUpload(type, fileList);
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
