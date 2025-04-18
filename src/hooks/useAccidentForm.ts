
import { useState } from 'react';
import { FormData } from '@/components/accident/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export const useAccidentForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    personalEmail: '',
    insuranceEmails: [],
    involvedPartyEmails: []
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
    if (currentStepIndex < 7) { // Hardcoded 7 as the last index
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
    formData,
    currentStepIndex,
    submitted,
    isSubmitting,
    uiToast,
    setCurrentStepIndex,
    setSubmitted,
    setIsSubmitting,
    setFormData,
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
  };
};
