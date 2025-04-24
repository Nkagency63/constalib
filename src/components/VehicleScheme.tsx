
import InteractiveScheme from './accident/InteractiveScheme';

// Default coordinates (Paris)
const DEFAULT_COORDS: [number, number] = [48.8566, 2.3522];

const VehicleScheme = () => {
  return (
    <div className="w-full">
      <InteractiveScheme 
        center={DEFAULT_COORDS}
        address="Emplacement par défaut"
      />
      
      <div className="text-sm text-constalib-dark-gray mt-4">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleScheme;
