
// Vehicle type
export interface Vehicle {
  id: string;
  position: [number, number];
  rotation: number;
  color: string;
  type: 'car' | 'truck' | 'bike';
  label?: string;
}

// Path type
export interface Path {
  id: string;
  points: [number, number][];
  color: string;
  width?: number;
  dashed?: boolean;
  isSelected?: boolean;
}

// Annotation type
export interface Annotation {
  id: string;
  position: [number, number];
  text: string;
}

// Scheme data type
export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number];
  zoom: number;
}

// Witness information
export interface WitnessInfo {
  id: string;
  name: string;
  contact: string;
  address: string;
}

// Circumstance information
export interface Circumstance {
  id: string;
  label: string;
  code: string;
  selected?: boolean;
}

// Form data type
export interface FormData {
  // Basic information
  accidentDate?: string;
  accidentTime?: string;
  accidentLocation?: string;
  geolocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // Vehicle information - Vehicle A (user's vehicle)
  licensePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  insuranceCompany?: string;
  policyNumber?: string;
  vehiclePhotos?: File[];
  damagePhotos?: File[];
  
  // Vehicle information - Vehicle B (other vehicle)
  otherVehicle?: {
    licensePlate?: string;
    brand?: string;
    model?: string;
    year?: string;
    insuranceCompany?: string;
    policyNumber?: string;
  };
  
  // Driver and insured information - Vehicle A
  driverName?: string;
  driverAddress?: string;
  driverPhone?: string;
  driverLicense?: string;
  insuredName?: string;
  insuredAddress?: string;
  insuredPhone?: string;
  
  // Driver and insured information - Vehicle B
  otherDriverName?: string;
  otherDriverAddress?: string;
  otherDriverPhone?: string;
  otherDriverLicense?: string;
  otherInsuredName?: string;
  otherInsuredAddress?: string;
  otherInsuredPhone?: string;
  
  // Witnesses and injuries
  hasWitnesses?: boolean;
  witnesses?: WitnessInfo[];
  hasInjuries?: boolean;
  injuriesDescription?: string;
  
  // Circumstances
  circumstancesA?: Circumstance[];
  circumstancesB?: Circumstance[];
  
  // Schema data
  schemeData?: SchemeData;
  
  // Review and submission
  insuranceEmails?: string[];
  involvedPartyEmails?: string[];
  personalEmail?: string;
  
  // Status tracking
  emergencyContacted?: boolean;
}
