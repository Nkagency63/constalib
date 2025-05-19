
import { useState } from 'react';
import ProgressBar from './accident/ProgressBar';
import StepNavigation from './accident/StepNavigation';
import SuccessMessage from './accident/SuccessMessage';
import StepRenderer from './accident/StepRenderer';
import { accidentFormSteps } from './accident/stepsConfig';
import { useAccidentForm } from '@/hooks/useAccidentForm';
import FormSubmissionHandler from './accident/FormSubmissionHandler';
import { WitnessInfo, SchemeData } from './accident/types';
import { FormContext } from '@/context/FormContext';

interface AccidentFormProps {
  onEmergencyRequest?: () => void;
  onStepChange?: (stepId: string) => void;
}

const AccidentForm = ({ onEmergencyRequest, onStepChange }: AccidentFormProps) => {
  const {
    formData,
    currentStepIndex,
    submitted,
    currentVehicleId,
    handleInputChange,
    handleOtherVehicleChange,
    handleCircumstanceChange,
    handlePhotoUpload,
    setVehicleInfo,
    setOtherVehicleInfo,
    setGeolocation,
    clearGeolocation,
    setInsuranceEmails,
    setInvolvedPartyEmails,
    setPersonalEmail,
    setCurrentVehicleId,
    onEmergencyContacted,
    nextStep,
    prevStep,
    setSubmitted,
    setHasInjuries,
    setInjuriesDescription,
    setHasWitnesses,
    setSchemeData,
    updateWitness: originalUpdateWitness,
    addWitness,
    removeWitness: originalRemoveWitness
  } = useAccidentForm();

  // Adapter function for witness management to match expected parameter types
  const updateWitness = (index: number, field: keyof WitnessInfo, value: string) => {
    // Find the witness ID by index
    if (formData.witnesses && formData.witnesses[index]) {
      const witnessId = formData.witnesses[index].id;
      originalUpdateWitness(witnessId, field, value);
    }
  };

  const removeWitness = (index: number) => {
    if (formData.witnesses && formData.witnesses[index]) {
      const witnessId = formData.witnesses[index].id;
      originalRemoveWitness(witnessId);
    }
  };

  // Vehicle info adapter with explicit typing
  const vehicleInfoAdapter = (data: { brand: string, model: string, year?: string, firstRegistration?: string }) => {
    // Cast data to match the expected structure in setVehicleInfo
    const vehicleData = {
      vehicleBrand: data.brand,
      vehicleModel: data.model,
      vehicleYear: data.year
    };
    
    setVehicleInfo(vehicleData as any);
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  const currentStep = accidentFormSteps[currentStepIndex];
  
  // Notify parent when step changes
  if (onStepChange) {
    onStepChange(currentStep.id);
  }

  return (
    <FormContext.Provider value={{ formData, currentVehicleId }}>
      <div className="max-w-3xl mx-auto">
        <ProgressBar 
          steps={accidentFormSteps} 
          currentStepIndex={currentStepIndex}
        />
        
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl font-bold text-constalib-dark mb-2">
            {currentStep.title}
          </h2>
          {currentStep.description && (
            <p className="text-constalib-dark-gray">
              {currentStep.description}
            </p>
          )}
        </div>
        
        <form onSubmit={(e) => e.preventDefault()} className="mb-8">
          <StepRenderer
            currentStepId={currentStep.id}
            formData={formData}
            handleInputChange={handleInputChange}
            handleOtherVehicleChange={handleOtherVehicleChange}
            handlePhotoUpload={(type, files) => {
              if (type === "vehicle" && files.length > 0) handlePhotoUpload("vehiclePhotos", files[0]);
              else if (type === "damage" && files.length > 0) handlePhotoUpload("damagePhotos", files[0]);
            }}
            setVehicleInfo={vehicleInfoAdapter}
            setOtherVehicleInfo={setOtherVehicleInfo}
            setGeolocation={setGeolocation}
            clearGeolocation={clearGeolocation}
            setInsuranceEmails={setInsuranceEmails}
            setInvolvedPartyEmails={setInvolvedPartyEmails}
            setPersonalEmail={setPersonalEmail}
            onEmergencyContacted={onEmergencyContacted}
            handleCircumstanceChange={handleCircumstanceChange}
            setCurrentVehicleId={(id: string) => setCurrentVehicleId(id as "A" | "B")}
            currentVehicleId={currentVehicleId}
            setHasInjuries={setHasInjuries}
            setInjuriesDescription={setInjuriesDescription}
            setHasWitnesses={setHasWitnesses}
            updateWitness={updateWitness}
            addWitness={addWitness}
            removeWitness={removeWitness}
            onSchemeUpdate={setSchemeData}
          />
        </form>
        
        {currentStep.id === "review" ? (
          <FormSubmissionHandler 
            formData={formData} 
            onSubmitSuccess={() => setSubmitted(true)}
          />
        ) : (
          <StepNavigation 
            prevStep={prevStep}
            nextStep={nextStep}
            handleSubmit={async (e) => e.preventDefault()}
            currentStepIndex={currentStepIndex}
            totalSteps={accidentFormSteps.length}
            isSubmitting={false}
            onEmergencyRequest={onEmergencyRequest}
          />
        )}
      </div>
    </FormContext.Provider>
  );
};

export default AccidentForm;
