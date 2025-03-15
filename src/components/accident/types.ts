
export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface VehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  description: string;
  firstRegistration?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
}

export interface FormData {
  date: string;
  time: string;
  location: string;
  description: string;
  vehiclePhotos: File[];
  damagePhotos: File[];
  // Premier véhicule (le vôtre)
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  firstRegistration?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
  // Second véhicule (l'autre impliqué)
  otherVehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    description: string;
    firstRegistration?: string;
    insurancePolicy?: string;
    insuranceCompany?: string;
  };
  geolocation: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  emergencyContacted: boolean;
}
