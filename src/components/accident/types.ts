
export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface VehicleData {
  id?: 'A' | 'B';
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
  // Informations d'email
  personalEmail: string;
  insuranceEmails: string[];
  involvedPartyEmails: string[];
}

export interface Vehicle {
  id: string;
  vehicleId?: 'A' | 'B';
  position: [number, number];
  color: string;
  brand?: string;
  model?: string;
  rotation: number;
  isSelected: boolean;
}

export interface Path {
  id: string;
  points: [number, number][];
  color: string;
  vehicleId?: string;
  isSelected: boolean;
}

export interface Annotation {
  id: string;
  position: [number, number];
  text: string;
  type: 'obstacle' | 'sign' | 'note';
}

export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number];
  zoom: number;
}
