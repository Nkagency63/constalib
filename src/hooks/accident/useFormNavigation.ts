
import { useState } from 'react';

export const useFormNavigation = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => {
    if (currentStepIndex < 8) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return {
    currentStepIndex,
    submitted,
    isSubmitting,
    setCurrentStepIndex,
    setSubmitted,
    setIsSubmitting,
    nextStep,
    prevStep
  };
};
