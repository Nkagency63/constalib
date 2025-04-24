
import React from 'react';
import InteractiveScheme from './accident/InteractiveScheme';
import { FormData } from './accident/types'; // Import the FormData type

const VehicleScheme = () => {
  // Create a minimal FormData object for the InteractiveScheme component
  const formData: FormData = {
    date: '', // Add empty string for required fields
    time: '',
    location: '',
    description: '',
    vehiclePhotos: [],
    damagePhotos: [],
    licensePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleDescription: '',
    insurancePolicy: '',
    insuranceCompany: '',
    otherVehicle: {
      licensePlate: '',
      brand: '',
      model: '',
      year: '',
      description: '',
      insurancePolicy: '',
      insuranceCompany: ''
    },
    geolocation: {
      lat: 48.8566, // Paris coordinates
      lng: 2.3522,
      address: "Emplacement par défaut"
    },
    emergencyContacted: false,
    personalEmail: '',
    insuranceEmails: [],
    involvedPartyEmails: [],
    firstRegistration: ''
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
