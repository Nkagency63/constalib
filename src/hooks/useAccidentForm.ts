import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WitnessInfo, SchemeData, Circumstance, GeolocationData } from '@/components/accident/types';
import { toast } from 'sonner';
import { DEFAULT_CIRCUMSTANCES } from '@/components/accident/defaultCircumstances';

export const useAccidentForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState<"A" | "B">("A");
  
  const [formData, setFormData] = useState<any>({
    // Set default values for form fields
    accidentDate: new Date().toISOString().split('T')[0],
    accidentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    circumstancesA: DEFAULT_CIRCUMSTANCES,
    circumstancesB: DEFAULT_CIRCUMSTANCES.map(c => ({ ...c })), // Create separate instances
    witnesses: [],
    // Driver and insured information
    driverName: '',
    driverAddress: '',
    driverPhone: '',
    driverLicense: '',
    insuredName: '',
    insuredAddress: '',
    insuredPhone: '',
    otherDriverName: '',
    otherDriverAddress: '',
    otherDriverPhone: '',
    otherDriverLicense: '',
    otherInsuredName: '',
    otherInsuredAddress: '',
    otherInsuredPhone: ''
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle other vehicle changes
  const handleOtherVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      otherVehicle: {
        ...prev.otherVehicle || {},
        [name]: value
      }
    }));
  };

  // Handle circumstance changes
  const handleCircumstanceChange = (vehicleId: "A" | "B", circumstanceId: string, checked: boolean) => {
    const field = vehicleId === "A" ? "circumstancesA" : "circumstancesB";
    
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((c: Circumstance) => 
        c.id === circumstanceId ? { ...c, selected: checked } : c
      )
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = (field: string, file: File) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), file]
    }));
    toast.success("Photo ajoutée");
  };

  // Set vehicle info
  const setVehicleInfo = (data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      ...data
    }));
  };

  // Set other vehicle info
  const setOtherVehicleInfo = (data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      otherVehicle: {
        ...prev.otherVehicle || {},
        ...data
      }
    }));
  };

  // Set geolocation
  const setGeolocation = (location: GeolocationData) => {
    setFormData((prev: any) => ({
      ...prev,
      geolocation: location
    }));
  };

  // Clear geolocation
  const clearGeolocation = () => {
    setFormData((prev: any) => ({
      ...prev,
      geolocation: { lat: null, lng: null, address: '' }
    }));
    toast.info('Localisation réinitialisée', {
      description: 'Les coordonnées GPS ont été effacées'
    });
  };

  // Set insurance emails
  const setInsuranceEmails = (emails: string[]) => {
    setFormData((prev: any) => ({
      ...prev,
      insuranceEmails: emails
    }));
  };

  // Set involved party emails
  const setInvolvedPartyEmails = (emails: string[]) => {
    setFormData((prev: any) => ({
      ...prev,
      involvedPartyEmails: emails
    }));
  };

  // Set personal email
  const setPersonalEmail = (email: string) => {
    setFormData((prev: any) => ({
      ...prev,
      personalEmail: email
    }));
  };

  // Emergency contacted flag
  const onEmergencyContacted = () => {
    setFormData((prev: any) => ({
      ...prev,
      emergencyContacted: true
    }));
  };

  // Copy driver info to insured info for vehicle A
  const copyDriverToInsured = () => {
    setFormData((prev: any) => ({
      ...prev,
      insuredName: prev.driverName,
      insuredAddress: prev.driverAddress,
      insuredPhone: prev.driverPhone
    }));
    toast.success("Informations copiées", {
      description: "Les informations du conducteur ont été copiées vers l'assuré"
    });
  };
  
  // Copy driver info to insured info for vehicle B
  const copyOtherDriverToInsured = () => {
    setFormData((prev: any) => ({
      ...prev,
      otherInsuredName: prev.otherDriverName,
      otherInsuredAddress: prev.otherDriverAddress,
      otherInsuredPhone: prev.otherDriverPhone
    }));
    toast.success("Informations copiées", {
      description: "Les informations du conducteur ont été copiées vers l'assuré"
    });
  };

  // Handle witnesses
  const setHasWitnesses = (hasWitnesses: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      hasWitnesses
    }));
  };

  const addWitness = () => {
    const newWitness: WitnessInfo = {
      id: uuidv4(),
      name: '',
      address: '',
      phone: '',
      email: ''
    };
    
    setFormData((prev: any) => ({
      ...prev,
      witnesses: [...(prev.witnesses || []), newWitness]
    }));
  };

  const updateWitness = (id: string, field: keyof WitnessInfo, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      witnesses: prev.witnesses.map((w: WitnessInfo) => 
        w.id === id ? { ...w, [field]: value } : w
      )
    }));
  };

  const removeWitness = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      witnesses: prev.witnesses.filter((w: WitnessInfo) => w.id !== id)
    }));
  };

  // Handle injuries
  const setHasInjuries = (hasInjuries: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      hasInjuries
    }));
  };

  const setInjuriesDescription = (injuriesDescription: string) => {
    setFormData((prev: any) => ({
      ...prev,
      injuriesDescription
    }));
  };
  
  // Handle scheme data
  const setSchemeData = (schemeData: SchemeData) => {
    setFormData((prev: any) => ({
      ...prev,
      schemeData
    }));
  };

  // Step navigation
  const nextStep = () => {
    setCurrentStepIndex(Math.min(currentStepIndex + 1, 7)); // Assuming we have 8 steps (0-7)
  };

  const prevStep = () => {
    setCurrentStepIndex(Math.max(currentStepIndex - 1, 0));
  };

  return {
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
    copyDriverToInsured,
    copyOtherDriverToInsured,
    nextStep,
    prevStep,
    setSubmitted,
    setHasInjuries,
    setInjuriesDescription,
    setHasWitnesses,
    updateWitness,
    addWitness,
    removeWitness,
    setSchemeData
  };
};
