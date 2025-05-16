
import React from 'react';

interface ReviewStepProps {
  formData: any;
  onFinalize: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, onFinalize }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium">Vérification des informations</h3>
        <p className="text-sm text-gray-500 mt-2">
          Voici un récapitulatif des informations que vous avez fournies. 
          Veuillez les vérifier avant de finaliser votre rapport d'accident.
        </p>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium">Date et heure</h4>
            <p className="text-sm">{formData.date || 'Non spécifié'}, {formData.time || 'Non spécifié'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium">Lieu</h4>
            <p className="text-sm">{formData.geolocation?.address || 'Non spécifié'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium">Votre véhicule</h4>
            <p className="text-sm">
              {formData.vehicleBrand || 'Non spécifié'} {formData.vehicleModel || ''}, 
              Plaque: {formData.licensePlate || 'Non spécifiée'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium">Autre véhicule</h4>
            <p className="text-sm">
              {formData.otherVehicle?.brand || 'Non spécifié'} {formData.otherVehicle?.model || ''}, 
              Plaque: {formData.otherVehicle?.licensePlate || 'Non spécifiée'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={onFinalize}
            className="px-4 py-2 bg-constalib-primary text-white rounded-md hover:bg-constalib-primary-dark transition"
          >
            Finaliser le rapport
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
