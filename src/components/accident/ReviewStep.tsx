
import React from 'react';
import { FormData } from './types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Camera } from 'lucide-react';

interface ReviewStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload: (type: 'vehicle' | 'damage', files: FileList) => void;
}

// Simple cards for different sections of the review
const VehicleCard = ({ vehicle }: { vehicle: any }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Information du véhicule</h3>
    <div className="space-y-2">
      <p><strong>Plaque:</strong> {vehicle.licensePlate}</p>
      <p><strong>Marque/Modèle:</strong> {vehicle.brand} {vehicle.model}</p>
      <p><strong>Année:</strong> {vehicle.year}</p>
      <p><strong>Assurance:</strong> {vehicle.insuranceCompany} - Police: {vehicle.insurancePolicy}</p>
    </div>
  </Card>
);

const OtherVehicleCard = ({ vehicle }: { vehicle: any }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Autre véhicule impliqué</h3>
    <div className="space-y-2">
      <p><strong>Plaque:</strong> {vehicle.licensePlate}</p>
      <p><strong>Marque/Modèle:</strong> {vehicle.brand} {vehicle.model}</p>
      <p><strong>Année:</strong> {vehicle.year}</p>
      <p><strong>Assurance:</strong> {vehicle.insuranceCompany} - Police: {vehicle.insurancePolicy}</p>
    </div>
  </Card>
);

const LocationCard = ({ formData }: { formData: FormData }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Lieu de l'accident</h3>
    <div className="space-y-2">
      <p><strong>Date:</strong> {formData.date}</p>
      <p><strong>Heure:</strong> {formData.time}</p>
      <p><strong>Adresse:</strong> {formData.geolocation?.address || formData.location}</p>
    </div>
  </Card>
);

const CircumstancesCard = ({ formData }: { formData: FormData }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Circonstances</h3>
    <div className="space-y-2">
      <p><strong>Véhicule A:</strong> {formData.vehicleACircumstances?.map(c => c.text || c.label).join(', ')}</p>
      <p><strong>Véhicule B:</strong> {formData.vehicleBCircumstances?.map(c => c.text || c.label).join(', ')}</p>
    </div>
  </Card>
);

const DetailsCard = ({ formData }: { formData: FormData }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Détails</h3>
    <div className="space-y-2">
      <p><strong>Blessés:</strong> {formData.hasInjuries ? 'Oui' : 'Non'}</p>
      {formData.hasInjuries && (
        <p><strong>Description:</strong> {formData.injuriesDescription}</p>
      )}
      <p><strong>Témoins:</strong> {formData.hasWitnesses ? 'Oui' : 'Non'}</p>
      {formData.hasWitnesses && formData.witnesses && formData.witnesses.length > 0 && (
        <div className="pl-4">
          {formData.witnesses.map((witness, idx) => (
            <p key={witness.id}><strong>Témoin {idx + 1}:</strong> {witness.name}, {witness.phone}</p>
          ))}
        </div>
      )}
    </div>
  </Card>
);

const DescriptionCard = ({ formData }: { formData: FormData }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Description</h3>
    <p>{formData.description || 'Aucune description fournie.'}</p>
  </Card>
);

const PhotoEvidenceCard = ({
  formData,
  handlePhotoUpload,
}: {
  formData: FormData;
  handlePhotoUpload: (type: 'vehicle' | 'damage', files: FileList) => void;
}) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Photos</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium mb-2">Photos du véhicule</h4>
        <div className="flex flex-wrap gap-2">
          {formData.vehiclePhotos && formData.vehiclePhotos.length > 0 ? (
            formData.vehiclePhotos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                <img 
                  src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                  alt={`Vehicle photo ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              className="h-24 w-24 flex flex-col items-center justify-center"
              onClick={() => document.getElementById('vehicle-photo-upload')?.click()}
            >
              <Camera className="h-5 w-5 mb-1" />
              <span className="text-xs">Ajouter</span>
            </Button>
          )}
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Photos des dégâts</h4>
        <div className="flex flex-wrap gap-2">
          {formData.damagePhotos && formData.damagePhotos.length > 0 ? (
            formData.damagePhotos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                <img 
                  src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                  alt={`Damage photo ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              className="h-24 w-24 flex flex-col items-center justify-center"
              onClick={() => document.getElementById('damage-photo-upload')?.click()}
            >
              <Camera className="h-5 w-5 mb-1" />
              <span className="text-xs">Ajouter</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  </Card>
);

const SchemeReviewCard = ({ formData }: { formData: FormData }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Schéma de l'accident</h3>
    {formData.schemeData ? (
      <p>Schéma disponible</p>
    ) : (
      <div className="p-4 bg-gray-100 rounded text-center text-gray-500">
        <AlertCircle className="mx-auto h-6 w-6 mb-2" />
        <p>Aucun schéma créé</p>
      </div>
    )}
  </Card>
);

const SignatureSection = () => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Signatures</h3>
    <p className="text-sm text-gray-600 mb-2">
      Les signatures électroniques seront recueillies lors de la finalisation du constat.
    </p>
    <div className="flex justify-end">
      <Button variant="outline">Signer le constat</Button>
    </div>
  </Card>
);

const CerfaGenerationButton = ({ formData }: { formData: FormData }) => (
  <div className="flex justify-center my-6">
    <Button variant="outline" className="mr-2">
      Télécharger le PDF
    </Button>
    <Button>
      Enregistrer officiellement
    </Button>
  </div>
);

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, handleInputChange, handlePhotoUpload }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Récapitulatif de la déclaration</h2>

      <VehicleCard
        vehicle={{
          licensePlate: formData.licensePlate || "",
          brand: formData.vehicleBrand || "",
          model: formData.vehicleModel || "",
          year: formData.vehicleYear || "",
          description: formData.vehicleDescription || "",
          insurancePolicy: formData.insurancePolicy,
          insuranceCompany: formData.insuranceCompany,
        }}
      />

      <OtherVehicleCard
        vehicle={{
          licensePlate: formData.otherVehicle.licensePlate || "",
          brand: formData.otherVehicle.brand || "",
          model: formData.otherVehicle.model || "",
          year: formData.otherVehicle.year || "",
          description: formData.otherVehicle.description || "",
          insurancePolicy: formData.otherVehicle.insurancePolicy,
          insuranceCompany: formData.otherVehicle.insuranceCompany,
        }}
      />

      <LocationCard formData={formData} />

      <CircumstancesCard formData={formData} />

      <DetailsCard formData={formData} />

      <DescriptionCard formData={formData} />

      <PhotoEvidenceCard
        formData={formData}
        handlePhotoUpload={handlePhotoUpload}
      />

      <SchemeReviewCard formData={formData} />
      
      <SignatureSection />

      <CerfaGenerationButton formData={formData} />
    </div>
  );
};

export default ReviewStep;
