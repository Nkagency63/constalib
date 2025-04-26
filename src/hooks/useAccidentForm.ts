import { useState } from 'react';
import { FormData, WitnessInfo } from '@/components/accident/types';
import { useToast } from '@/hooks/use-toast';

export const useAccidentForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState<'A' | 'B'>('A');
  const { toast: uiToast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    location: '',
    description: '',
    vehiclePhotos: [],
    damagePhotos: [],
    licensePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleDescription: '',
    insurancePolicy: '',
    insuranceCompany: '',
    otherVehicle: {
      licensePlate: '',
      brand: '',
      model: '',
      year: '',
      description: '',
      insurancePolicy: '',
      insuranceCompany: ''
    },
    geolocation: {
      lat: null,
      lng: null,
      address: ''
    },
    emergencyContacted: false,
    vehicleACircumstances: [],
    vehicleBCircumstances: [],
    personalEmail: '',
    insuranceEmails: [],
    involvedPartyEmails: [],
    currentVehicleId: 'A',
    hasInjuries: false,
    injuriesDescription: '',
    hasWitnesses: false,
    witnesses: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtherVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'otherVehicleInsurancePolicy') {
      setFormData(prev => ({
        ...prev,
        otherVehicle: {
          ...prev.otherVehicle,
          insurancePolicy: value
        }
      }));
      return;
    }
    
    if (name === 'otherVehicleInsuranceCompany') {
      setFormData(prev => ({
        ...prev,
        otherVehicle: {
          ...prev.otherVehicle,
          insuranceCompany: value
        }
      }));
      return;
    }
    
    const fieldName = name.replace('otherVehicle', '');
    
    setFormData(prev => ({
      ...prev,
      otherVehicle: {
        ...prev.otherVehicle,
        [fieldName]: value
      }
    }));
  };

  const handleCircumstanceChange = (vehicleId: 'A' | 'B', circumstanceId: string, isChecked: boolean) => {
    const field = vehicleId === 'A' ? 'vehicleACircumstances' : 'vehicleBCircumstances';
    
    setFormData(prev => {
      if (isChecked) {
        if (!prev[field].includes(circumstanceId)) {
          return {
            ...prev,
            [field]: [...prev[field], circumstanceId]
          };
        }
        return prev;
      } else {
        return {
          ...prev,
          [field]: prev[field].filter(id => id !== circumstanceId)
        };
      }
    });
  };

  const handlePhotoUpload = (type: 'vehiclePhotos' | 'damagePhotos', file: File) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], file]
    }));
  };

  const setVehicleInfo = (data: {brand: string, model: string, year: string, firstRegistration?: string}) => {
    setFormData(prev => ({
      ...prev,
      vehicleBrand: data.brand,
      vehicleModel: data.model,
      vehicleYear: data.year,
      firstRegistration: data.firstRegistration
    }));
  };

  const setOtherVehicleInfo = (data: {brand: string, model: string, year: string, firstRegistration?: string}) => {
    setFormData(prev => ({
      ...prev,
      otherVehicle: {
        ...prev.otherVehicle,
        brand: data.brand,
        model: data.model,
        year: data.year,
        firstRegistration: data.firstRegistration
      }
    }));
  };

  const setGeolocation = (data: {lat: number, lng: number, address: string}) => {
    setFormData(prev => ({
      ...prev,
      geolocation: {
        lat: data.lat,
        lng: data.lng,
        address: data.address
      }
    }));
  };

  const setInsuranceEmails = (emails: string[]) => {
    setFormData(prev => ({
      ...prev,
      insuranceEmails: emails
    }));
  };

  const setInvolvedPartyEmails = (emails: string[]) => {
    setFormData(prev => ({
      ...prev,
      involvedPartyEmails: emails
    }));
  };

  const setPersonalEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      personalEmail: email
    }));
  };

  const onEmergencyContacted = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacted: true
    }));
  };

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

  const updateCurrentVehicleId = (vehicleId: 'A' | 'B') => {
    setCurrentVehicleId(vehicleId);
    setFormData(prev => ({
      ...prev,
      currentVehicleId: vehicleId
    }));
  };

  const setHasInjuries = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasInjuries: value,
      injuriesDescription: value ? prev.injuriesDescription : ''
    }));
  };

  const setInjuriesDescription = (value: string) => {
    setFormData(prev => ({
      ...prev,
      injuriesDescription: value
    }));
  };

  const setHasWitnesses = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasWitnesses: value,
      witnesses: value ? prev.witnesses : []
    }));
  };

  const updateWitness = (index: number, field: keyof WitnessInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.map((witness, i) => 
        i === index ? { ...witness, [field]: value } : witness
      )
    }));
  };

  const addWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, { fullName: '', phone: '', email: '' }]
    }));
  };

  const removeWitness = (index: number) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter((_, i) => i !== index)
    }));
  };

  return {
    formData,
    currentStepIndex,
    submitted,
    isSubmitting,
    currentVehicleId,
    uiToast,
    setCurrentStepIndex,
    setSubmitted,
    setIsSubmitting,
    setFormData,
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
    setCurrentVehicleId: updateCurrentVehicleId,
    onEmergencyContacted,
    nextStep,
    prevStep,
    setHasInjuries,
    setInjuriesDescription,
    setHasWitnesses,
    updateWitness,
    addWitness,
    removeWitness
  };
};
