import { useState } from 'react';
import ProgressBar from './accident/ProgressBar';
import StepNavigation from './accident/StepNavigation';
import SuccessMessage from './accident/SuccessMessage';
import StepRenderer from './accident/StepRenderer';
import { accidentFormSteps } from './accident/stepsConfig';
import { useAccidentForm } from '@/hooks/useAccidentForm';
import FormSubmissionHandler from './accident/FormSubmissionHandler';

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
    updateWitness,
    addWitness,
    removeWitness
  } = useAccidentForm();

  if (submitted) {
    return <SuccessMessage />;
  }

  const currentStep = accidentFormSteps[currentStepIndex];
  
  // Notify parent when step changes
  if (onStepChange) {
    onStepChange(currentStep.id);
  }

  return (
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
          handlePhotoUpload={handlePhotoUpload}
          setVehicleInfo={setVehicleInfo}
          setOtherVehicleInfo={setOtherVehicleInfo}
          setGeolocation={setGeolocation}
          setInsuranceEmails={setInsuranceEmails}
          setInvolvedPartyEmails={setInvolvedPartyEmails}
          setPersonalEmail={setPersonalEmail}
          onEmergencyContacted={onEmergencyContacted}
          handleCircumstanceChange={handleCircumstanceChange}
          setCurrentVehicleId={setCurrentVehicleId}
          setHasInjuries={setHasInjuries}
          setInjuriesDescription={setInjuriesDescription}
          setHasWitnesses={setHasWitnesses}
          updateWitness={updateWitness}
          addWitness={addWitness}
          removeWitness={removeWitness}
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
          handleSubmit={(e) => e.preventDefault()}
          currentStepIndex={currentStepIndex}
          totalSteps={accidentFormSteps.length}
          isSubmitting={false}
          onEmergencyRequest={onEmergencyRequest}
        />
      )}
    </div>
  );
};

export default AccidentForm;
