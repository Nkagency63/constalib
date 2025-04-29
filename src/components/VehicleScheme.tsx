
import { toast } from 'sonner';
import InteractiveScheme from './accident/InteractiveScheme';
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

  const handleSchemeUpdate = (schemeData: SchemeData) => {
    console.log('Scheme data updated:', schemeData);
    toast.success("Schéma sauvegardé avec succès");
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
