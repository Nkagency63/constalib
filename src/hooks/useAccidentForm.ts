import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WitnessInfo, GeolocationData, SchemeData } from '@/components/accident/types';
import { useLocationForm } from './accident/useLocationForm';
import { useWitnessForm } from './accident/useWitnessForm';
import { useInjuriesForm } from './accident/useInjuriesForm';
import { useVehicleForm } from './accident/useVehicleForm';
import { useEmergencyForm } from './accident/useEmergencyForm';
import { useCircumstancesForm } from './accident/useCircumstancesForm';
import { useEmailForm } from './accident/useEmailForm';

export const useAccidentForm = () => {
  // General form state
  const [submitted, setSubmitted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Date and time fields
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  
  // Description fields
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  // Material damage fields
  const [hasMaterialDamage, setHasMaterialDamage] = useState(false);
  const [materialDamageDescription, setMaterialDamageDescription] = useState('');
  
  // Photo evidence
  const [vehiclePhotos, setVehiclePhotos] = useState<(File | string)[]>([]);
  const [damagePhotos, setDamagePhotos] = useState<(File | string)[]>([]);
  
  // Geolocation
  const [geolocation, setGeolocationState] = useState<GeolocationData | null>(null);

  // Scheme data
  const [schemeData, setSchemeData] = useState<SchemeData | null>(null);
  
  // Use the specialized hooks for different form sections
  const locationForm = useLocationForm();
  const witnessForm = useWitnessForm();
  const injuriesForm = useInjuriesForm();
  const vehicleForm = useVehicleForm();
  const emergencyForm = useEmergencyForm();
  const circumstancesForm = useCircumstancesForm();
  const emailForm = useEmailForm();

  // Form navigation
  const nextStep = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, 10));
  };

  const prevStep = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  // Handling input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;

    switch (name) {
      case 'date':
        setDate(value);
        break;
      case 'time':
        setTime(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'hasMaterialDamage':
        setHasMaterialDamage(checked);
        break;
      case 'materialDamageDescription':
        setMaterialDamageDescription(value);
        break;
      default:
        console.warn(`Input ${name} not handled`);
    }
  };

  // Photo upload handling
  const handlePhotoUpload = (type: 'vehiclePhotos' | 'damagePhotos', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      switch (type) {
        case 'vehiclePhotos':
          setVehiclePhotos(prev => [...prev, base64String]);
          break;
        case 'damagePhotos':
          setDamagePhotos(prev => [...prev, base64String]);
          break;
        default:
          console.warn(`Photo type ${type} not handled`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Geolocation handling
  const setGeolocation = (location: GeolocationData) => {
    console.log('Setting geolocation:', location);
    setGeolocationState(location);
  };
  
  const clearGeolocation = () => {
    console.log('Clearing geolocation');
    setGeolocationState(null);
  };
  
  // Form data aggregation
  const formData = {
    // Basic information
    date,
    time,
    location,
    description,
    hasMaterialDamage,
    materialDamageDescription,
    emergencyContacted: emergencyForm.emergencyContacted,
    
    // Vehicles data
    ...vehicleForm.getVehicleData(),
    
    // Injuries
    hasInjuries: injuriesForm.hasInjuries,
    injuriesDescription: injuriesForm.injuriesDescription,
    
    // Witness information
    hasWitnesses: witnessForm.hasWitnesses,
    witnesses: witnessForm.witnesses,
    
    // Photos
    vehiclePhotos,
    damagePhotos,
    
    // Circumstances
    vehicleACircumstances: circumstancesForm.vehicleACircumstances,
    vehicleBCircumstances: circumstancesForm.vehicleBCircumstances,
    
    // Emails
    personalEmail: emailForm.personalEmail,
    insuranceEmails: emailForm.insuranceEmails,
    involvedPartyEmails: emailForm.involvedPartyEmails,
    
    // Geolocation
    geolocation: geolocation || { lat: 0, lng: 0, address: '' },
    
    // Scheme data
    schemeData,
    
    // Current vehicle ID for forms
    currentVehicleId: vehicleForm.currentVehicleId,
  };

  // Return the entire form state and methods
  return {
    formData,
    currentStepIndex,
    currentVehicleId: vehicleForm.currentVehicleId,
    submitted,
    
    // Basic form navigation
    nextStep: () => setCurrentStepIndex(prev => Math.min(prev + 1, 10)),
    prevStep: () => setCurrentStepIndex(prev => Math.max(prev - 1, 0)),
    setSubmitted,
    
    // Input handlers
    handleInputChange,
    handleOtherVehicleChange: vehicleForm.handleOtherVehicleChange,
    handleCircumstanceChange: circumstancesForm.handleCircumstanceChange,
    handlePhotoUpload,
    
    // Specialized setters
    setVehicleInfo: vehicleForm.setVehicleInfo,
    setOtherVehicleInfo: vehicleForm.setOtherVehicleInfo,
    setCurrentVehicleId: vehicleForm.updateCurrentVehicleId,
    setGeolocation,
    clearGeolocation,
    setHasInjuries: injuriesForm.setHasInjuries,
    setInjuriesDescription: injuriesForm.setInjuriesDescription,
    setHasWitnesses: witnessForm.setHasWitnesses,
    setPersonalEmail: emailForm.setPersonalEmail,
    setInsuranceEmails: emailForm.setInsuranceEmails,
    setInvolvedPartyEmails: emailForm.setInvolvedPartyEmails,
    setSchemeData,
    
    // Helper functions
    onEmergencyContacted: emergencyForm.setEmergencyContacted,
    
    // Witness management
    updateWitness: witnessForm.updateWitness,
    addWitness: witnessForm.addWitness,
    removeWitness: witnessForm.removeWitness,
  };
};
