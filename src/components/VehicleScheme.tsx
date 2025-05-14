
import { toast } from 'sonner';
import InteractiveScheme from './accident/InteractiveScheme';
import { SchemeData } from './accident/types';
import { useState } from 'react';

const VehicleScheme = () => {
  // Données par défaut (Paris)
  const demoFormData = {
    geolocation: {
      lat: 48.8566,
      lng: 2.3522,
      address: "Emplacement par défaut"
    },
    vehicleBrand: "Renault",
    vehicleModel: "Clio",
    otherVehicle: {
      brand: "Peugeot",
      model: "208"
    }
  };

  const [hasShownSaveToast, setHasShownSaveToast] = useState(false);

  const handleSchemeUpdate = (schemeData: SchemeData) => {
    console.log('Scheme data updated:', schemeData);
    
    // N'afficher le toast que lors de la première modification
    if (!hasShownSaveToast) {
      toast("Schéma enregistré", {
        description: "Les modifications sont sauvegardées automatiquement"
      });
      setHasShownSaveToast(true);
    }
  };

  return (
    <div className="w-full">
      <InteractiveScheme 
        formData={demoFormData}
        onUpdateSchemeData={handleSchemeUpdate}
      />
      
      <div className="text-sm text-constalib-dark-gray mt-4">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleScheme;
