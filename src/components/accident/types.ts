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

export interface WitnessInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface InjuryInfo {
  name: string;
  contact: string;
}

export interface MaterialDamage {
  description: string;
  value?: number;
  photos?: File[];
}

export interface DriverInfo {
  name: string;
  address: string;
  phone: string;
  licenseNumber: string;
  licenseDate?: string;
}

export interface InsuredInfo {
  name: string;
  address: string;
  phone: string;
  email?: string;
  policyNumber?: string;
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
  
  // Informations pour les circonstances
  vehicleACircumstances: string[];
  vehicleBCircumstances: string[];
  
  // Informations d'email
  personalEmail: string;
  insuranceEmails: string[];
  involvedPartyEmails: string[];
  
  // Propriété pour suivre le véhicule actuellement sélectionné
  currentVehicleId?: 'A' | 'B';
  
  // Propriétés pour les blessés et témoins
  hasInjuries: boolean;
  injuriesDescription?: string;
  hasWitnesses: boolean;
  witnesses: WitnessInfo[];
  
  // Informations du conducteur du véhicule A
  driverName?: string;
  driverAddress?: string;
  driverPhone?: string;
  driverLicense?: string;
  driverLicenseDate?: string; // Nouvelle propriété pour la date d'obtention du permis
  
  // Informations de l'assuré du véhicule A
  insuredName?: string;
  insuredAddress?: string;
  insuredPhone?: string;
  insuredEmail?: string;
  
  // Informations du conducteur du véhicule B
  otherDriverName?: string;
  otherDriverAddress?: string;
  otherDriverPhone?: string;
  otherDriverLicense?: string;
  otherDriverLicenseDate?: string; // Nouvelle propriété pour la date d'obtention du permis
  
  // Informations de l'assuré du véhicule B
  otherInsuredName?: string;
  otherInsuredAddress?: string;
  otherInsuredPhone?: string;
  otherInsuredEmail?: string;
  
  // Dégâts matériels
  hasMaterialDamage?: boolean;
  materialDamageDescription?: string;
  
  // Liste des blessés
  injuries?: InjuryInfo[];
  
  // Informations structurées des véhicules pour le CERFA
  vehicleLabels?: {
    A: {
      brand: string;
      model: string;
      licensePlate: string;
    };
    B: {
      brand: string;
      model: string;
      licensePlate: string;
    };
  };
  
  // Informations structurées des conducteurs pour le CERFA
  driverInfo?: {
    A: {
      name: string;
      address: string;
      licenseNumber: string;
      phone: string;
      licenseDate?: string; // Ajout de la date d'obtention du permis
    };
    B: {
      name: string;
      address: string;
      licenseNumber: string;
      phone: string;
      licenseDate?: string; // Ajout de la date d'obtention du permis
    };
  };
  
  // Informations structurées des assurés pour le CERFA
  insuredInfo?: {
    A: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    B: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
  };
}

export interface Vehicle {
  id: string;
  vehicleId: 'A' | 'B' | 'C' | 'D';
  position: [number, number];
  color: string;
  brand?: string;
  model?: string;
  rotation: number;
  isSelected: boolean;
  vehicleType: 'car' | 'truck' | 'bike';
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

export interface Circumstance {
  id: string;
  label: string;
  description: string;
}

export interface CircumstanceCategory {
  id: string;
  title: string;
  circumstances: Circumstance[];
}
