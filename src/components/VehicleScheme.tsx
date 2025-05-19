
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
    vehicles: [
      {
        id: 'vehicle-A',
        type: 'car',
        position: [200, 200],
        x: 200,
        y: 200,
        width: 80,
        height: 40,
        rotation: 0,
        color: '#3b82f6',
        label: 'Véhicule A',
        isSelected: false
      },
      {
        id: 'vehicle-B',
        type: 'car',
        position: [300, 300],
        x: 300,
        y: 300,
        width: 80,
        height: 40,
        rotation: 45,
        color: '#ef4444',
        label: 'Véhicule B',
        isSelected: false
      }
    ],
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
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <h3 className="text-lg font-semibold mb-2">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray mb-4">
          Positionnez les véhicules pour illustrer l'accident. 
          Glissez-déposez pour déplacer, utilisez les poignées pour redimensionner et pivoter.
        </p>
        <div className="h-[500px] flex justify-center">
          <SchemeContainer 
            formData={demoFormData}
            onSchemeUpdate={handleSchemeUpdate}
            initialData={schemeData}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleScheme;
