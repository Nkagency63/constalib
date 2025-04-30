
import { FormData } from './types';
import { Check, Car, MapPin, Calendar, Clock, FileText, Image, CarTaxiFront, Shield, Mail } from 'lucide-react';
import CerfaGenerationButton from './CerfaGenerationButton';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  const hasEmailRecipients = formData.personalEmail || formData.insuranceEmails.length > 0 || formData.involvedPartyEmails.length > 0;
  
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
              {(formData.insurancePolicy || formData.insuranceCompany) && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-constalib-dark-gray">
                    <Shield className="h-4 w-4 text-constalib-blue" />
                    <span className="font-medium">Assurance:</span>
                  </div>
                  {formData.insurancePolicy && (
                    <p className="text-sm text-constalib-dark-gray ml-5">
                      <span className="font-medium">N° de police:</span> {formData.insurancePolicy}
                    </p>
                  )}
                  {formData.insuranceCompany && (
                    <p className="text-sm text-constalib-dark-gray ml-5">
                      <span className="font-medium">Compagnie:</span> {formData.insuranceCompany}
                    </p>
                  )}
                </div>
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
              {(formData.otherVehicle.insurancePolicy || formData.otherVehicle.insuranceCompany) && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-constalib-dark-gray">
                    <Shield className="h-4 w-4 text-constalib-blue" />
                    <span className="font-medium">Assurance:</span>
                  </div>
                  {formData.otherVehicle.insurancePolicy && (
                    <p className="text-sm text-constalib-dark-gray ml-5">
                      <span className="font-medium">N° de police:</span> {formData.otherVehicle.insurancePolicy}
                    </p>
                  )}
                  {formData.otherVehicle.insuranceCompany && (
                    <p className="text-sm text-constalib-dark-gray ml-5">
                      <span className="font-medium">Compagnie:</span> {formData.otherVehicle.insuranceCompany}
                    </p>
                  )}
                </div>
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
        
        {hasEmailRecipients && (
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-constalib-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-constalib-dark">Envoi du constat</h4>
                {formData.personalEmail && (
                  <p className="text-sm text-constalib-dark-gray">
                    <span className="font-medium">Votre email:</span> {formData.personalEmail}
                  </p>
                )}
                
                {formData.insuranceEmails.length > 0 && (
                  <div className="mt-1">
                    <p className="text-sm text-constalib-dark-gray">
                      <span className="font-medium">Compagnies d'assurance:</span> 
                    </p>
                    <ul className="list-disc pl-5 text-sm text-constalib-dark-gray">
                      {formData.insuranceEmails.map((email, index) => (
                        <li key={index}>{email}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {formData.involvedPartyEmails.length > 0 && (
                  <div className="mt-1">
                    <p className="text-sm text-constalib-dark-gray">
                      <span className="font-medium">Personnes impliquées:</span> 
                    </p>
                    <ul className="list-disc pl-5 text-sm text-constalib-dark-gray">
                      {formData.involvedPartyEmails.map((email, index) => (
                        <li key={index}>{email}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
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
      
      <div className="flex justify-center mt-6">
        <CerfaGenerationButton formData={formData} className="w-full md:w-auto" />
      </div>
    </div>
  );
};

export default ReviewStep;
