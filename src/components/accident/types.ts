import { Dispatch, SetStateAction } from 'react';
import L from 'leaflet';

// Type for vehicle information
export interface VehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  year?: string;
  firstRegistration?: string;
  description?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
}

// Type for witness information
export interface WitnessInfo {
  id: string;
  name: string;
  fullName?: string;
  address: string;
  phone?: string;
  email?: string;
  contact?: string;
}

// Type for circumstance options in the accident form
export interface Circumstance {
  id: string;
  code: string;
  text?: string;
  label: string;
  image?: string;
  selected: boolean;
}

// Injury information
export interface InjuryInfo {
  name: string;
  severity: 'minor' | 'moderate' | 'severe';
  description?: string;
}

// Types for scheme (accident diagram) data structures
export interface Vehicle {
  id: string;
  type: 'car' | 'truck' | 'bike';
  position: [number, number]; // LatLng coordinates
  rotation: number;
  color: string;
  label?: string;
  width?: number;
  isSelected?: boolean;
}

export interface Path {
  id: string;
  points: [number, number][]; // Array of LatLng coordinates
  color: string;
  width: number;
  dashed: boolean;
  vehicleId?: string;
  isSelected?: boolean;
}

export interface Annotation {
  id: string;
  position: [number, number]; // LatLng coordinates
  text: string;
}

export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number]; // LatLng for the map center
  zoom: number;
}

// Type for circumstance data passed to the registration service
export interface CircumstancesData {
  vehicleA: string[];
  vehicleB: string[];
}

// Main form data type for the accident report
export interface FormData {
  // Basic information
  date: string;
  time: string;
  location: string;
  hasInjuries: boolean;
  hasMaterialDamage: boolean;
  emergencyContacted: boolean;
  injuriesDescription?: string;
  injuries?: InjuryInfo[];
  materialDamageDescription?: string;
  description?: string; // Added for DetailsStep
  
  // Vehicle information
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear?: string;
  licensePlate: string;
  insuranceCompany?: string;
  insurancePolicy?: string;
  vehicleDescription?: string;
  
  // Other vehicle information
  otherVehicle: {
    brand: string;
    model: string;
    year?: string;
    licensePlate: string;
    insuranceCompany?: string;
    insurancePolicy?: string;
    description?: string;
    firstRegistration?: string;
  };
  
  // Vehicle labels for CERFA
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
  
  // Driver and insured information
  driverName?: string;
  driverAddress?: string;
  driverPhone?: string;
  driverLicense?: string;
  insuredName?: string;
  insuredAddress?: string;
  insuredPhone?: string;
  
  // Other driver and insured information
  otherDriverName?: string;
  otherDriverAddress?: string;
  otherDriverPhone?: string;
  otherDriverLicense?: string;
  otherInsuredName?: string;
  otherInsuredAddress?: string;
  otherInsuredPhone?: string;
  otherInsuredEmail?: string;
  
  // Circumstance selections
  vehicleACircumstances?: Circumstance[];
  vehicleBCircumstances?: Circumstance[];
  circumstances?: {
    vehicleA: Circumstance[];
    vehicleB: Circumstance[];
  };
  
  // Driver info for CERFA
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
  
  // Insured info for CERFA
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
  
  // Contact information
  personalEmail?: string;
  insuranceEmails?: string[];
  involvedPartyEmails?: string[];
  
  // Photo evidence
  vehiclePhotos?: File[] | string[];
  damagePhotos?: File[] | string[];
  
  // Geolocation
  geolocation: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // Witnesses
  hasWitnesses?: boolean;
  witnesses?: WitnessInfo[];
  
  // Scheme data
  schemeData?: SchemeData;
  
  // Current vehicle ID for forms
  currentVehicleId?: string;
}

// Type for geolocation data
export interface GeolocationData {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number;
  timestamp?: number;
}
