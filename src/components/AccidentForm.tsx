import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Step, FormData } from './accident/types';

import BasicInfoStep from './accident/BasicInfoStep';
import DetailsStep from './accident/DetailsStep';
import PhotosStep from './accident/PhotosStep';
import SchemeStep from './accident/SchemeStep';
import ReviewStep from './accident/ReviewStep';
import SuccessMessage from './accident/SuccessMessage';
import ProgressBar from './accident/ProgressBar';
import StepNavigation from './accident/StepNavigation';
import VehicleIdentificationStep from './accident/VehicleIdentificationStep';
import LocationStep from './accident/LocationStep';
import MultiVehicleStep from './accident/MultiVehicleStep';
import EmailStep from './accident/EmailStep';

interface AccidentFormProps {
  onEmergencyRequest?: () => void;
}

const AccidentForm = ({ onEmergencyRequest }: AccidentFormProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
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
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: uiToast } = useToast();
  
  const steps: Step[] = [
    {
      id: 'basics',
      title: 'Informations de base',
      description: 'Date et heure de l\'accident'
    },
    {
      id: 'location',
      title: 'Localisation',
      description: 'Adresse précise de l\'accident'
    },
    {
      id: 'vehicles',
      title: 'Véhicules',
      description: 'Identification des véhicules impliqués'
    },
    {
      id: 'details',
      title: 'Détails',
      description: 'Description de l\'accident'
    },
    {
      id: 'photos',
      title: 'Photos',
      description: 'Photographies des véhicules et des dégâts'
    },
    {
      id: 'scheme',
      title: 'Schéma',
      description: 'Positionnement des véhicules'
    },
    {
      id: 'email',
      title: 'Envoi',
      description: 'Destinataires du constat'
    },
    {
      id: 'review',
      title: 'Vérification',
      description: 'Vérifiez les informations avant de soumettre'
    }
  ];

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

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
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

  const uploadPhotos = async (files: File[], prefix: string) => {
    const uploadedFileUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${prefix}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('accident_photos')
        .upload(filePath, file);
      
      if (error) {
        console.error('Error uploading file:', error);
        uiToast({
          title: "Erreur lors de l'upload",
          description: `Impossible de télécharger l'image: ${error.message}`,
          variant: "destructive"
        });
        continue; // Skip this file but continue with others
      }
      
      uploadedFileUrls.push(filePath);
    }
    
    return uploadedFileUrls;
  };

  const saveVehicleData = async (vehicleData: {
    license_plate: string,
    brand: string,
    model: string,
    year: string,
    first_registration?: string,
    insurance_policy?: string,
    insurance_company?: string
  }) => {
    if (!vehicleData.license_plate) {
      return null; // No vehicle data to save
    }

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .upsert({
          license_plate: vehicleData.license_plate,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.year,
          first_registration: vehicleData.first_registration,
          insurance_policy: vehicleData.insurance_policy,
          insurance_company: vehicleData.insurance_company
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error saving vehicle data:', error);
        return null;
      }
      
      return data.id;
    } catch (err) {
      console.error('Error in saving vehicle:', err);
      return null;
    }
  };

  const onEmergencyContacted = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacted: true
    }));
  };

  const sendEmails = async (reportId: string) => {
    const allRecipients = [
      ...formData.insuranceEmails,
      ...formData.involvedPartyEmails
    ];
    
    if (formData.personalEmail) {
      allRecipients.push(formData.personalEmail);
    }
    
    if (allRecipients.length === 0) {
      console.log("No recipients specified, skipping email sending");
      return;
    }
    
    try {
      const vehicleInfo = `${formData.vehicleBrand} ${formData.vehicleModel} (${formData.vehicleYear}), Immatriculation: ${formData.licensePlate}, Assurance: ${formData.insuranceCompany || 'Non spécifiée'}, N° de police: ${formData.insurancePolicy || 'Non spécifié'}`;
      
      const otherVehicleInfo = `${formData.otherVehicle.brand} ${formData.otherVehicle.model} (${formData.otherVehicle.year}), Immatriculation: ${formData.otherVehicle.licensePlate}, Assurance: ${formData.otherVehicle.insuranceCompany || 'Non spécifiée'}, N° de police: ${formData.otherVehicle.insurancePolicy || 'Non spécifié'}`;
      
      const { data, error } = await supabase.functions.invoke('send-accident-report', {
        body: {
          to: allRecipients,
          subject: `Constat Amiable d'Accident - Ref: ${reportId}`,
          reportId,
          reportData: formData,
          vehicleInfo,
          otherVehicleInfo,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          description: formData.description,
          hasPhotos: formData.vehiclePhotos.length > 0 || formData.damagePhotos.length > 0
        }
      });
      
      if (error) {
        console.error("Error sending emails:", error);
        throw new Error(error.message);
      }
      
      console.log("Emails sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in sendEmails function:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const vehicleId = await saveVehicleData({
        license_plate: formData.licensePlate,
        brand: formData.vehicleBrand,
        model: formData.vehicleModel,
        year: formData.vehicleYear,
        first_registration: formData.firstRegistration,
        insurance_policy: formData.insurancePolicy,
        insurance_company: formData.insuranceCompany
      });
      
      const otherVehicleId = await saveVehicleData({
        license_plate: formData.otherVehicle.licensePlate,
        brand: formData.otherVehicle.brand,
        model: formData.otherVehicle.model,
        year: formData.otherVehicle.year,
        first_registration: formData.otherVehicle.firstRegistration,
        insurance_policy: formData.otherVehicle.insurancePolicy,
        insurance_company: formData.otherVehicle.insuranceCompany
      });
      
      const vehiclePhotoUrls = await uploadPhotos(formData.vehiclePhotos, 'vehicle');
      const damagePhotoUrls = await uploadPhotos(formData.damagePhotos, 'damage');
      
      const { data, error } = await supabase
        .from('accident_reports')
        .insert({
          date: formData.date,
          time: formData.time,
          location: formData.location,
          description: formData.description,
          vehicle_photos: vehiclePhotoUrls,
          damage_photos: damagePhotoUrls,
          vehicle_id: vehicleId,
          other_vehicle_id: otherVehicleId,
          geolocation_lat: formData.geolocation.lat,
          geolocation_lng: formData.geolocation.lng,
          geolocation_address: formData.geolocation.address,
          emergency_contacted: formData.emergencyContacted,
          vehicle_insurance_policy: formData.insurancePolicy,
          vehicle_insurance_company: formData.insuranceCompany,
          other_vehicle_insurance_policy: formData.otherVehicle.insurancePolicy,
          other_vehicle_insurance_company: formData.otherVehicle.insuranceCompany
        })
        .select();
      
      if (error) {
        console.error('Error saving accident report:', error);
        uiToast({
          title: "Erreur",
          description: `Impossible d'enregistrer la déclaration: ${error.message}`,
          variant: "destructive"
        });
        toast.error(`Impossible d'enregistrer la déclaration: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log('Accident report saved:', data);
      
      if (data && data[0] && (formData.personalEmail || formData.insuranceEmails.length > 0 || formData.involvedPartyEmails.length > 0)) {
        try {
          await sendEmails(data[0].id);
          uiToast({
            title: "Emails envoyés",
            description: "Le constat a été envoyé par email aux destinataires spécifiés.",
            variant: "default"
          });
        } catch (emailError: any) {
          console.error("Error sending emails:", emailError);
          uiToast({
            title: "Alerte",
            description: `La déclaration a été enregistrée mais l'envoi des emails a échoué: ${emailError.message}`,
            variant: "destructive"
          });
        }
      }
      
      uiToast({
        title: "Succès",
        description: "Votre déclaration a été envoyée avec succès.",
        variant: "default"
      });
      toast.success("Votre déclaration a été envoyée avec succès.");
      setSubmitted(true);
    } catch (err) {
      console.error('Error in submission process:', err);
      uiToast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre déclaration.",
        variant: "destructive"
      });
      toast.error("Une erreur est survenue lors de la soumission de votre déclaration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStepIndex];
    
    switch (step.id) {
      case 'basics':
        return (
          <BasicInfoStep 
            date={formData.date}
            time={formData.time}
            handleInputChange={handleInputChange}
          />
        );
      
      case 'location':
        return (
          <LocationStep
            location={formData.location}
            handleInputChange={handleInputChange}
            setGeolocation={setGeolocation}
          />
        );
        
      case 'vehicles':
        return (
          <MultiVehicleStep
            licensePlate={formData.licensePlate}
            vehicleBrand={formData.vehicleBrand}
            vehicleModel={formData.vehicleModel}
            vehicleYear={formData.vehicleYear}
            vehicleDescription={formData.vehicleDescription}
            insurancePolicy={formData.insurancePolicy}
            insuranceCompany={formData.insuranceCompany}
            otherVehicle={formData.otherVehicle}
            handleInputChange={handleInputChange}
            handleOtherVehicleChange={handleOtherVehicleChange}
            setVehicleInfo={setVehicleInfo}
            setOtherVehicleInfo={setOtherVehicleInfo}
          />
        );
        
      case 'details':
        return (
          <DetailsStep
            description={formData.description}
            handleInputChange={handleInputChange}
          />
        );
        
      case 'photos':
        return (
          <PhotosStep handlePhotoUpload={handlePhotoUpload} />
        );
        
      case 'scheme':
        return (
          <SchemeStep />
        );
        
      case 'email':
        return (
          <EmailStep
            insuranceEmails={formData.insuranceEmails}
            setInsuranceEmails={setInsuranceEmails}
            involvedPartyEmails={formData.involvedPartyEmails}
            setInvolvedPartyEmails={setInvolvedPartyEmails}
            personalEmail={formData.personalEmail}
            setPersonalEmail={setPersonalEmail}
          />
        );
        
      case 'review':
        return (
          <ReviewStep formData={formData} />
        );
        
      default:
        return null;
    }
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar 
        steps={steps} 
        currentStepIndex={currentStepIndex}
      />
      
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold text-constalib-dark mb-2">
          {steps[currentStepIndex].title}
        </h2>
        {steps[currentStepIndex].description && (
          <p className="text-constalib-dark-gray">
            {steps[currentStepIndex].description}
          </p>
        )}
      </div>
      
      <form onSubmit={(e) => e.preventDefault()} className="mb-8">
        {renderStepContent()}
      </form>
      
      <StepNavigation 
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmit={handleSubmit}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isSubmitting={isSubmitting}
        onEmergencyRequest={onEmergencyRequest}
      />
    </div>
  );
};

export default AccidentForm;
