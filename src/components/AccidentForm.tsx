
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Step, FormData } from './accident/types';

// Import step components
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

const AccidentForm = () => {
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
    geolocation: {
      lat: null,
      lng: null,
      address: ''
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: uiToast } = useToast();
  
  // Define steps
  const steps: Step[] = [
    {
      id: 'basics',
      title: 'Informations de base',
      description: 'Date, heure et lieu de l\'accident'
    },
    {
      id: 'location',
      title: 'Localisation',
      description: 'Adresse précise de l\'accident'
    },
    {
      id: 'vehicle',
      title: 'Véhicule',
      description: 'Identification de votre véhicule'
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
      id: 'review',
      title: 'Vérification',
      description: 'Vérifiez les informations avant de soumettre'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (type: 'vehiclePhotos' | 'damagePhotos', file: File) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], file]
    }));
  };

  const setVehicleInfo = (data: {brand: string, model: string, year: string}) => {
    setFormData(prev => ({
      ...prev,
      vehicleBrand: data.brand,
      vehicleModel: data.model,
      vehicleYear: data.year
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

  // Upload photos to Supabase storage
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

  // Store vehicle data
  const saveVehicleData = async () => {
    if (!formData.licensePlate) {
      return null; // No vehicle data to save
    }

    try {
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .upsert({
          license_plate: formData.licensePlate,
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year: formData.vehicleYear
        })
        .select('id')
        .single();
      
      if (vehicleError) {
        console.error('Error saving vehicle data:', vehicleError);
        return null;
      }
      
      return vehicleData.id;
    } catch (err) {
      console.error('Error in saving vehicle:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save vehicle data first
      const vehicleId = await saveVehicleData();
      
      // Upload photos
      const vehiclePhotoUrls = await uploadPhotos(formData.vehiclePhotos, 'vehicle');
      const damagePhotoUrls = await uploadPhotos(formData.damagePhotos, 'damage');
      
      // Then save the report data
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
          geolocation_lat: formData.geolocation.lat,
          geolocation_lng: formData.geolocation.lng,
          geolocation_address: formData.geolocation.address
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

  // Render form based on current step
  const renderStepContent = () => {
    const step = steps[currentStepIndex];
    
    switch (step.id) {
      case 'basics':
        return (
          <BasicInfoStep 
            date={formData.date}
            time={formData.time}
            location={formData.location}
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
        
      case 'vehicle':
        return (
          <VehicleIdentificationStep
            licensePlate={formData.licensePlate}
            vehicleBrand={formData.vehicleBrand}
            vehicleModel={formData.vehicleModel}
            vehicleYear={formData.vehicleYear}
            vehicleDescription={formData.vehicleDescription}
            handleInputChange={handleInputChange}
            setVehicleInfo={setVehicleInfo}
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
      
      {/* Current step header */}
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
      
      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-8">
        {renderStepContent()}
      </form>
      
      {/* Navigation */}
      <StepNavigation 
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmit={handleSubmit}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AccidentForm;
