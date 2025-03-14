
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

const AccidentForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    location: '',
    description: '',
    vehiclePhotos: [],
    damagePhotos: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Define steps
  const steps: Step[] = [
    {
      id: 'basics',
      title: 'Informations de base',
      description: 'Date, heure et lieu de l\'accident'
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
        toast({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload photos first
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
          damage_photos: damagePhotoUrls
        })
        .select();
      
      if (error) {
        console.error('Error saving accident report:', error);
        toast({
          title: "Erreur",
          description: `Impossible d'enregistrer la déclaration: ${error.message}`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Accident report saved:', data);
      toast({
        title: "Succès",
        description: "Votre déclaration a été envoyée avec succès.",
        variant: "default"
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error in submission process:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre déclaration.",
        variant: "destructive"
      });
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
