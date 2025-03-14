
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar, MapPin, AlertCircle, Check } from 'lucide-react';
import Button from './Button';
import PhotoCapture from './PhotoCapture';
import VehicleScheme from './VehicleScheme';

// Step interface
interface Step {
  id: string;
  title: string;
  description?: string;
}

// Form data interface
interface FormData {
  date: string;
  time: string;
  location: string;
  description: string;
  vehiclePhotos: File[];
  damagePhotos: File[];
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setSubmitted(true);
  };

  // Render form based on current step
  const renderStepContent = () => {
    const step = steps[currentStepIndex];
    
    switch (step.id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-constalib-dark">
                Date de l'accident
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium text-constalib-dark">
                Heure de l'accident
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-constalib-dark">
                Lieu de l'accident
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Adresse ou description du lieu"
                  className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue pl-10"
                  required
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
              </div>
              <p className="text-sm text-constalib-dark-gray mt-1">
                Saisissez l'adresse précise ou décrivez le lieu de l'accident
              </p>
            </div>
          </div>
        );
        
      case 'details':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-constalib-dark">
                Description de l'accident
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Décrivez les circonstances de l'accident..."
                className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue resize-none"
                required
              />
              <p className="text-sm text-constalib-dark-gray mt-1">
                Soyez aussi précis que possible. Mentionnez les conditions météorologiques, l'état de la route, etc.
              </p>
            </div>
            
            <div className="bg-constalib-light-blue p-4 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-constalib-blue flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-constalib-blue font-medium">Conseil</h4>
                <p className="text-sm text-constalib-dark-gray">
                  N'admettez pas de responsabilité dans votre description. Contentez-vous de décrire objectivement les faits.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'photos':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-constalib-dark">Photos des véhicules</h3>
              <p className="text-sm text-constalib-dark-gray">
                Prenez des photos de l'ensemble des véhicules impliqués dans l'accident.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PhotoCapture 
                  onPhotoCapture={(file) => handlePhotoUpload('vehiclePhotos', file)} 
                  label="Photo du véhicule (vue d'ensemble)"
                />
                <PhotoCapture 
                  onPhotoCapture={(file) => handlePhotoUpload('vehiclePhotos', file)} 
                  label="Photo de la plaque d'immatriculation"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-constalib-dark">Photos des dégâts</h3>
              <p className="text-sm text-constalib-dark-gray">
                Prenez des photos détaillées des dommages subis par les véhicules.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PhotoCapture 
                  onPhotoCapture={(file) => handlePhotoUpload('damagePhotos', file)} 
                  label="Photo des dégâts (vue rapprochée)"
                />
                <PhotoCapture 
                  onPhotoCapture={(file) => handlePhotoUpload('damagePhotos', file)} 
                  label="Photo supplémentaire (si nécessaire)"
                />
              </div>
            </div>
          </div>
        );
        
      case 'scheme':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
              <p className="text-sm text-constalib-dark-gray">
                Positionnez les véhicules pour représenter visuellement l'accident.
              </p>
            </div>
            
            <VehicleScheme />
          </div>
        );
        
      case 'review':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-constalib-dark">Récapitulatif</h3>
              <p className="text-sm text-constalib-dark-gray">
                Vérifiez les informations saisies avant de soumettre votre déclaration.
              </p>
              
              <div className="bg-constalib-light-blue rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-constalib-dark">Date et heure</h4>
                  <p className="text-constalib-dark-gray">{formData.date} à {formData.time || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-constalib-dark">Lieu</h4>
                  <p className="text-constalib-dark-gray">{formData.location || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-constalib-dark">Description</h4>
                  <p className="text-constalib-dark-gray">{formData.description || 'Aucune description fournie'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-constalib-dark">Photos</h4>
                  <p className="text-constalib-dark-gray">
                    {formData.vehiclePhotos.length} photo(s) de véhicule(s), {formData.damagePhotos.length} photo(s) de dégât(s)
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Une fois soumise, votre déclaration sera envoyée à votre assureur et ne pourra plus être modifiée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-constalib-dark mb-4">Déclaration envoyée avec succès !</h2>
        <p className="text-constalib-dark-gray mb-8">
          Votre déclaration d'accident a été transmise. Un conseiller vous contactera prochainement pour vous accompagner dans vos démarches.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-constalib-blue">
            Étape {currentStepIndex + 1} sur {steps.length}
          </span>
          <span className="text-sm text-constalib-dark-gray">
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-constalib-light-gray rounded-full h-2">
          <div 
            className="bg-constalib-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step indicators */}
      <div className="hidden md:flex justify-between mb-8 relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-constalib-light-gray -translate-y-1/2 z-0"></div>
        
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="flex flex-col items-center relative z-10"
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                index < currentStepIndex 
                  ? 'bg-constalib-blue text-white' 
                  : index === currentStepIndex 
                    ? 'bg-white border-2 border-constalib-blue text-constalib-blue'
                    : 'bg-white border border-constalib-light-gray text-constalib-dark-gray'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span 
              className={`text-xs font-medium whitespace-nowrap ${
                index <= currentStepIndex ? 'text-constalib-dark' : 'text-constalib-dark-gray'
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
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
      <form onSubmit={handleSubmit} className="mb-8">
        {renderStepContent()}
      </form>
      
      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-constalib-light-gray">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Précédent
        </Button>
        
        {currentStepIndex < steps.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Suivant
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit}>
            Soumettre
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccidentForm;
