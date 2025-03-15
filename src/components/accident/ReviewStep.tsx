
import { AlertCircle, MapPin, Car } from 'lucide-react';
import { FormData } from './types';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
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
            {formData.geolocation && formData.geolocation.lat && formData.geolocation.lng && (
              <div className="flex items-center mt-1 text-xs text-constalib-dark-gray">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  Coordonnées: {formData.geolocation.lat.toFixed(6)}, {formData.geolocation.lng.toFixed(6)}
                </span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-constalib-dark">Véhicule</h4>
            <div className="flex items-center mt-1">
              <Car className="h-4 w-4 mr-2 text-constalib-dark-gray" />
              <p className="text-constalib-dark-gray">
                {formData.licensePlate ? (
                  <>
                    <span className="font-medium">{formData.licensePlate}</span>
                    {formData.vehicleBrand && formData.vehicleModel ? (
                      <> - {formData.vehicleBrand} {formData.vehicleModel} {formData.vehicleYear}</>
                    ) : (
                      ' (Informations du véhicule non disponibles)'
                    )}
                  </>
                ) : (
                  'Aucune information de véhicule fournie'
                )}
              </p>
            </div>
            {formData.vehicleDescription && (
              <p className="text-sm text-constalib-dark-gray mt-1 ml-6">
                {formData.vehicleDescription}
              </p>
            )}
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
};

export default ReviewStep;
