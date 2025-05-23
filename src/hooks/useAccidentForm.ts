
import { useState, useMemo } from 'react';
import { FormData } from '@/components/accident/types';
import { useToast } from '@/hooks/use-toast';
import { useFormNavigation } from './accident/useFormNavigation';
import { useVehicleForm } from './accident/useVehicleForm';
import { useCircumstancesForm } from './accident/useCircumstancesForm';
import { useWitnessForm } from './accident/useWitnessForm';
import { useInjuriesForm } from './accident/useInjuriesForm';
import { useLocationForm } from './accident/useLocationForm';
import { usePhotosForm } from './accident/usePhotosForm';
import { useEmailForm } from './accident/useEmailForm';
import { useEmergencyForm } from './accident/useEmergencyForm';
import { useDriversInsuredForm } from './accident/useDriversInsuredForm';

export const useAccidentForm = () => {
  // Toast notification hook
  const { toast: uiToast } = useToast();
  
  // Initialize all the specialized form hooks
  const navigation = useFormNavigation();
  const vehicleForm = useVehicleForm();
  const circumstancesForm = useCircumstancesForm();
  const witnessForm = useWitnessForm();
  const injuriesForm = useInjuriesForm();
  const locationForm = useLocationForm();
  const photosForm = usePhotosForm();
  const emailForm = useEmailForm();
  const emergencyForm = useEmergencyForm();
  const driversInsuredForm = useDriversInsuredForm();

  // Combine all form data into a single FormData object
  const formData: FormData = useMemo(() => {
    return {
      ...locationForm.getLocationData(),
      ...vehicleForm.getVehicleData(),
      ...circumstancesForm.getCircumstancesData(),
      ...witnessForm.getWitnessData(),
      ...injuriesForm.getInjuriesData(),
      ...photosForm.getPhotosData(),
      ...emailForm.getEmailData(),
      ...emergencyForm.getEmergencyData(),
      ...driversInsuredForm.getDriversInsuredData()
    } as FormData;
  }, [
    locationForm,
    vehicleForm,
    circumstancesForm,
    witnessForm,
    injuriesForm,
    photosForm,
    emailForm,
    emergencyForm,
    driversInsuredForm
  ]);

  return {
    // Form data
    formData,
    
    // Navigation state and methods
    currentStepIndex: navigation.currentStepIndex,
    submitted: navigation.submitted,
    isSubmitting: navigation.isSubmitting,
    nextStep: navigation.nextStep,
    prevStep: navigation.prevStep,
    setCurrentStepIndex: navigation.setCurrentStepIndex,
    setSubmitted: navigation.setSubmitted,
    setIsSubmitting: navigation.setIsSubmitting,
    
    // Vehicle form methods
    currentVehicleId: vehicleForm.currentVehicleId,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      locationForm.handleInputChange(e);
      vehicleForm.handleInputChange(e);
    },
    handleOtherVehicleChange: vehicleForm.handleOtherVehicleChange,
    setVehicleInfo: vehicleForm.setVehicleInfo,
    setOtherVehicleInfo: vehicleForm.setOtherVehicleInfo,
    setCurrentVehicleId: vehicleForm.updateCurrentVehicleId,
    
    // Circumstance form methods
    handleCircumstanceChange: circumstancesForm.handleCircumstanceChange,
    
    // Witness form methods
    setHasWitnesses: witnessForm.setHasWitnesses,
    updateWitness: witnessForm.updateWitness,
    addWitness: witnessForm.addWitness,
    removeWitness: witnessForm.removeWitness,
    
    // Injuries form methods
    setHasInjuries: injuriesForm.setHasInjuries,
    setInjuriesDescription: injuriesForm.setInjuriesDescription,
    
    // Location/geolocation methods
    setGeolocation: locationForm.setGeolocation,
    
    // Photo upload methods
    handlePhotoUpload: photosForm.handlePhotoUpload,
    
    // Email form methods
    setPersonalEmail: emailForm.setPersonalEmail,
    setInsuranceEmails: emailForm.setInsuranceEmails,
    setInvolvedPartyEmails: emailForm.setInvolvedPartyEmails,
    
    // Emergency methods
    onEmergencyContacted: emergencyForm.onEmergencyContacted,
    
    // Drivers and Insured form methods
    updateDriverA: driversInsuredForm.updateDriverA,
    updateDriverB: driversInsuredForm.updateDriverB,
    updateInsuredA: driversInsuredForm.updateInsuredA,
    updateInsuredB: driversInsuredForm.updateInsuredB,
    
    // Toast notifications
    uiToast
  };
};
