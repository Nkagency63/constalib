
import React from 'react';
import PhotoCapture from '../PhotoCapture';

interface PhotosStepProps {
  vehiclePhotos: File[];
  damagePhotos: File[];
  handlePhotoUpload: (type: 'vehiclePhotos' | 'damagePhotos', file: File) => void;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ vehiclePhotos, damagePhotos, handlePhotoUpload }) => {
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
        
        {vehiclePhotos.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">{vehiclePhotos.length} photo(s) de véhicule(s) ajoutée(s)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vehiclePhotos.map((photo, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={photo instanceof File ? URL.createObjectURL(photo) : photo as string} 
                    alt={`Vehicle photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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
        
        {damagePhotos.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">{damagePhotos.length} photo(s) de dégâts ajoutée(s)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {damagePhotos.map((photo, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={photo instanceof File ? URL.createObjectURL(photo) : photo as string} 
                    alt={`Damage photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosStep;
