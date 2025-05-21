
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
    nextStep,
    prevStep,
    setSubmitted
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
        />
      </form>
      
      <FormSubmissionHandler 
        formData={formData} 
        onSubmitSuccess={() => setSubmitted(true)}
      >
        {({ handleSubmit, isSubmitting }) => (
          <StepNavigation 
            prevStep={prevStep}
            nextStep={nextStep}
            handleSubmit={handleSubmit}
            currentStepIndex={currentStepIndex}
            totalSteps={accidentFormSteps.length}
            isSubmitting={isSubmitting}
            onEmergencyRequest={onEmergencyRequest}
          />
        )}
      </FormSubmissionHandler>
    </div>
  );
};

export default AccidentForm;
