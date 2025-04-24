
import React from 'react';
import InteractiveScheme from './accident/InteractiveScheme';
import { FormData } from './accident/types';

const VehicleScheme = () => {
  const formData: FormData = {
    date: '',
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
    hasInjuries: false,
    hasWitnesses: false,
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
      lat: 48.8566,
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

