
import PhotoCapture from '../PhotoCapture';

interface PhotosStepProps {
  vehiclePhotos: File[];
  damagePhotos: File[];
  handlePhotoUpload: (type: 'vehiclePhotos' | 'damagePhotos', file: File) => void;
}

const PhotosStep = ({ vehiclePhotos, damagePhotos, handlePhotoUpload }: PhotosStepProps) => {
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
};

export default PhotosStep;
