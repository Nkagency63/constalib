
import { toast } from 'sonner';
import { useState } from 'react';
import SchemeContainer from './accident/scheme/SchemeContainer';
import { SchemeData } from './accident/types';

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
  const [schemeData, setSchemeData] = useState<SchemeData>({
    vehicles: [],
    paths: [],
    annotations: [],
    center: [48.8566, 2.3522],
    zoom: 17
  });

  const handleSchemeUpdate = (updatedSchemeData: SchemeData) => {
    console.log('Scheme data updated:', updatedSchemeData);
    setSchemeData(updatedSchemeData);
    
    // N'afficher le toast que lors de la première modification
    if (!hasShownSaveToast && (
      updatedSchemeData.vehicles.length > 0 || 
      updatedSchemeData.paths.length > 0 || 
      updatedSchemeData.annotations.length > 0
    )) {
      toast("Les modifications sont sauvegardées automatiquement");
      setHasShownSaveToast(true);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 h-[500px]">
        <SchemeContainer 
          formData={demoFormData}
          onSchemeUpdate={handleSchemeUpdate}
          initialData={schemeData}
        />
      </div>
      
      <div className="text-sm text-constalib-dark-gray mt-4">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleScheme;
