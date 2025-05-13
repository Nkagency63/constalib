// Types pour le schéma d'accident
export interface Vehicle {
  id: string;
  position: [number, number]; // Coordonnées [latitude, longitude]
  color: string;
  vehicleId: 'A' | 'B' | 'C' | 'D'; // Identifiant du véhicule (A, B, C, D)
  rotation: number; // Rotation en degrés
  isSelected: boolean;
  vehicleType: 'car' | 'truck' | 'bike';
  brand?: string; // Marque du véhicule
  model?: string; // Modèle du véhicule
}

// Type pour une trajectoire de véhicule
export interface Path {
  id: string;
  points: [number, number][]; // Tableau de points [latitude, longitude]
  color: string;
  vehicleId?: string; // ID du véhicule associé à cette trajectoire
  isSelected: boolean;
}

// Type pour une annotation sur le schéma
export interface Annotation {
  id: string;
  position: [number, number]; // Coordonnées [latitude, longitude]
  text: string;
}

// Type pour les données du schéma complet
export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number]; // Centre de la vue [latitude, longitude]
  zoom: number;
}

// Types pour les données du formulaire d'accident
export interface FormData {
  // Informations de base
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  
  // Géolocalisation
  geolocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // Informations sur le premier véhicule
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  licensePlate?: string;
  firstRegistration?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
  vehicleDescription?: string;
  
  // Informations sur l'autre véhicule
  otherVehicle?: {
    brand?: string;
    model?: string;
    year?: string;
    licensePlate?: string;
    firstRegistration?: string;
    insurancePolicy?: string;
    insuranceCompany?: string;
    description?: string;
  };
  
  // Informations sur les conducteurs et assurés
  driverName?: string;
  driverAddress?: string;
  driverPhone?: string;
  driverLicense?: string;
  insuredName?: string;
  insuredAddress?: string;
  insuredPhone?: string;
  
  otherDriverName?: string;
  otherDriverAddress?: string;
  otherDriverPhone?: string;
  otherDriverLicense?: string;
  otherInsuredName?: string;
  otherInsuredAddress?: string;
  otherInsuredPhone?: string;
  otherInsuredEmail?: string;
  
  // Circonstances de l'accident
  vehicleACircumstances?: string[];
  vehicleBCircumstances?: string[];
  
  // Photos
  vehiclePhotos?: File[] | string[];
  damagePhotos?: File[] | string[];
  
  // Blessures et témoins
  hasInjuries?: boolean;
  injuriesDescription?: string;
  injuries?: Array<{name: string, contact: string}>;
  hasWitnesses?: boolean;
  witnesses?: Array<WitnessInfo>;
  
  // Dommages matériels
  hasMaterialDamage?: boolean;
  materialDamageDescription?: string;
  
  // Emails
  personalEmail?: string;
  insuranceEmails?: string[];
  involvedPartyEmails?: string[];
  
  // Services d'urgence
  emergencyContacted?: boolean;
  
  // État actuel de la navigation
  currentVehicleId?: 'A' | 'B';
  
  // Données du schéma
  schemeData?: SchemeData;
  
  // Données supplémentaires pour PDF
  vehicleLabels?: {
    A: {
      brand: string;
      model: string;
      licensePlate: string;
    },
    B: {
      brand: string;
      model: string;
      licensePlate: string;
    }
  };
  
  // Informations supplémentaires pour le PDF
  driverInfo?: {
    A: {
      name: string;
      address: string;
      licenseNumber: string;
      phone: string;
    },
    B: {
      name: string;
      address: string;
      licenseNumber: string;
      phone: string;
    }
  };
  
  insuredInfo?: {
    A: {
      name: string;
      address: string;
      phone: string;
      email: string;
    },
    B: {
      name: string;
      address: string;
      phone: string;
      email: string;
    }
  };
}

// Add missing type definitions
export interface CircumstanceCategory {
  id: string;
  title: string;
  circumstances: Circumstance[];
}

export interface Circumstance {
  id: string;
  description: string;
  icon?: string;
  selected?: boolean;
}

export interface WitnessInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface VehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  description: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
}
