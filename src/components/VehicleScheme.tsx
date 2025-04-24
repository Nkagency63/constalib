
import React from 'react';
import InteractiveScheme from './accident/InteractiveScheme';

const VehicleScheme = () => {
  // Create a minimal FormData object for the InteractiveScheme component
  const formData = {
    geolocation: {
      lat: 48.8566, // Paris coordinates
      lng: 2.3522,
      address: "Emplacement par défaut"
    },
    vehicleBrand: '',
    vehicleModel: '',
    otherVehicle: {
      brand: '',
      model: ''
    }
  };

  return (
    <div className="w-full">
      <InteractiveScheme formData={formData} />
      
      <div className="text-sm text-constalib-dark-gray mt-4">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleScheme;
