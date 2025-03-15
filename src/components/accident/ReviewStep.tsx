
import { FormData } from './types';
import { Check, Car, MapPin, Calendar, Clock, FileText, Image, CarTaxiFront } from 'lucide-react';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Vérifiez votre déclaration</h3>
        <p className="text-sm text-constalib-dark-gray">
          Voici un récapitulatif des informations que vous avez saisies. Vérifiez-les avant de soumettre votre déclaration.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-constalib-blue mt-0.5" />
            <div>
              <h4 className="font-medium text-constalib-dark">Date et heure</h4>
              <p className="text-sm text-constalib-dark-gray">{formData.date} à {formData.time}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-constalib-blue mt-0.5" />
            <div>
              <h4 className="font-medium text-constalib-dark">Lieu de l'accident</h4>
              <p className="text-sm text-constalib-dark-gray">{formData.location}</p>
              {formData.geolocation.address && (
                <p className="text-xs text-constalib-dark-gray mt-1">
                  Adresse géolocalisée: {formData.geolocation.address}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-start gap-2">
            <Car className="h-5 w-5 text-constalib-blue mt-0.5" />
            <div>
              <h4 className="font-medium text-constalib-dark">Votre véhicule</h4>
              <p className="text-sm text-constalib-dark-gray">
                <span className="font-medium">Immatriculation:</span> {formData.licensePlate}
              </p>
              <p className="text-sm text-constalib-dark-gray">
                <span className="font-medium">Marque/Modèle:</span> {formData.vehicleBrand} {formData.vehicleModel} ({formData.vehicleYear})
              </p>
              {formData.vehicleDescription && (
                <p className="text-sm text-constalib-dark-gray">
                  <span className="font-medium">Description:</span> {formData.vehicleDescription}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-start gap-2">
            <CarTaxiFront className="h-5 w-5 text-constalib-blue mt-0.5" />
            <div>
              <h4 className="font-medium text-constalib-dark">Véhicule adverse</h4>
              <p className="text-sm text-constalib-dark-gray">
                <span className="font-medium">Immatriculation:</span> {formData.otherVehicle.licensePlate || "Non renseigné"}
              </p>
              {formData.otherVehicle.brand && (
                <p className="text-sm text-constalib-dark-gray">
                  <span className="font-medium">Marque/Modèle:</span> {formData.otherVehicle.brand} {formData.otherVehicle.model} ({formData.otherVehicle.year})
                </p>
              )}
              {formData.otherVehicle.description && (
                <p className="text-sm text-constalib-dark-gray">
                  <span className="font-medium">Description:</span> {formData.otherVehicle.description}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-constalib-blue mt-0.5" />
            <div>
              <h4 className="font-medium text-constalib-dark">Description de l'accident</h4>
              <p className="text-sm text-constalib-dark-gray">{formData.description || "Aucune description fournie"}</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-start gap-2">
            <Image className="h-5 w-5 text-constalib-blue mt-0.5" />
            <div>
              <h4 className="font-medium text-constalib-dark">Photos</h4>
              <p className="text-sm text-constalib-dark-gray">
                <span className="font-medium">Photos du véhicule:</span> {formData.vehiclePhotos.length} photo(s)
              </p>
              <p className="text-sm text-constalib-dark-gray">
                <span className="font-medium">Photos des dégâts:</span> {formData.damagePhotos.length} photo(s)
              </p>
            </div>
          </div>
        </div>
        
        {formData.emergencyContacted && (
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-constalib-dark">Secours contactés</h4>
                <p className="text-sm text-constalib-dark-gray">Vous avez indiqué avoir contacté les services d'urgence.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
