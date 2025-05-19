
import { WitnessInfo, GeolocationData, SchemeData, Circumstance } from "./types";

export interface FormData {
  // Basic information
  date: string;
  time: string;
  location: string;
  description: string;
  hasMaterialDamage: boolean;
  materialDamageDescription: string;
  emergencyContacted: boolean;
  
  // Vehicles data
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  insurancePolicy: string;
  insuranceCompany: string;
  otherVehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    description: string;
    insurancePolicy: string;
    insuranceCompany: string;
    firstRegistration?: string;
  };
  currentVehicleId: 'A' | 'B';
  
  // Injuries
  hasInjuries: boolean;
  injuriesDescription: string;
  
  // Witness information
  hasWitnesses: boolean;
  witnesses: WitnessInfo[];
  
  // Photos
  vehiclePhotos: string[];
  damagePhotos: string[];
  
  // Circumstances
  vehicleACircumstances: Circumstance[];
  vehicleBCircumstances: Circumstance[];
  
  // Emails
  personalEmail: string;
  insuranceEmails: string[];
  involvedPartyEmails: string[];
  
  // Geolocation
  geolocation: {
    lat: number;
    lng: number;
    address: string;
    accuracy: number;
    timestamp: string;
  };
  
  // Additional fields required by API
  userId: string;
  city: string;
  country: string;
  
  // Scheme data
  schemeData: SchemeData | null;
}
