// Vehicle types for the scheme
export interface Vehicle {
  id: string;
  position: [number, number];
  rotation: number;
  color: string;
  type: 'car' | 'truck' | 'bike';
}

export interface Path {
  id: string;
  points: [number, number][];
  color: string;
  vehicleId?: string;
}

export interface Annotation {
  id: string;
  position: [number, number];
  text: string;
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
  text: string;
  selected?: boolean;
}

export interface CircumstancesData {
  vehicleA: string[];
  vehicleB: string[];
}

export interface InjuryInfo {
  id: string;
  name: string;
  severity?: string;
  description?: string;
}

export interface WitnessInfo {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

// FormData interface to ensure type safety throughout the application
export interface FormData {
  // Basic accident information
  date: string;
  time: string;
  location: string;
  description?: string;
  
  // Geolocation data
  geolocation: {
    lat: number;
    lng: number;
    address: string;
    accuracy?: number;
    timestamp?: number;
  };
  
  // Vehicle information
  licensePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleDescription?: string;
  insuranceCompany?: string;
  insurancePolicy?: string;
  
  // Other vehicle information
  otherVehicle: {
    licensePlate?: string;
    brand?: string;
    model?: string;
    year?: string;
    description?: string;
    insuranceCompany?: string;
    insurancePolicy?: string;
  };
  
  // Driver and insured information
  driverName?: string;
  driverAddress?: string;
  driverPhone?: string;
  driverLicense?: string;
  insuredName?: string;
  insuredAddress?: string;
  insuredPhone?: string;
  personalEmail?: string;
  
  // Other driver and insured information
  otherDriverName?: string;
  otherDriverAddress?: string;
  otherDriverPhone?: string;
  otherDriverLicense?: string;
  otherInsuredName?: string;
  otherInsuredAddress?: string;
  otherInsuredPhone?: string;
  otherInsuredEmail?: string;
  
  // Circumstances
  vehicleACircumstances?: Circumstance[];
  vehicleBCircumstances?: Circumstance[];
  
  // Injuries
  hasInjuries?: boolean;
  injuriesDescription?: string;
  injuries?: InjuryInfo[];
  
  // Material damage
  hasMaterialDamage?: boolean;
  materialDamageDescription?: string;
  
  // Witnesses
  hasWitnesses?: boolean;
  witnesses?: WitnessInfo[];
  
  // Photos
  vehiclePhotos?: File[];
  damagePhotos?: File[];
  
  // Scheme data
  schemeData?: SchemeData;
  
  // Vehicle labels (for reference in UI display)
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
  
  // Driver info structured by vehicle
  driverInfo?: {
    A: {
      name: string;
      address: string;
      licenseNumber: string;
      phone: string;
    };
    B: {
      name: string;
      address: string;
      licenseNumber: string;
      phone: string;
    };
  };
  
  // Insured info structured by vehicle
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
