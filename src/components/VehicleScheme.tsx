
import InteractiveScheme from './accident/InteractiveScheme';

// Default coordinates (Paris)
const DEFAULT_COORDS = [48.8566, 2.3522];

const VehicleScheme = () => {
  // Create a simple formData object with just the geolocation data
  const demoFormData = {
    geolocation: {
      lat: DEFAULT_COORDS[0],
      lng: DEFAULT_COORDS[1],
      address: "Emplacement par défaut"
    }
  };

  return (
    <div className="w-full">
      <InteractiveScheme 
        formData={demoFormData}
      />
      
      <div className="text-sm text-constalib-dark-gray mt-4">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleScheme;
