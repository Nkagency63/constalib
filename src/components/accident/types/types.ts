
export interface WitnessInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface GeolocationData {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number;
  timestamp?: number | string;
}

export interface SchemeData {
  vehicles: VehicleSchemeData[];
  paths: PathData[];
  annotations: AnnotationData[];
  center: [number, number];
  zoom: number;
}

export interface VehicleSchemeData {
  id: string;
  type: string;
  position: [number, number];
  color: string;
  rotation: number;
  isSelected?: boolean;
  label: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface PathData {
  id: string;
  points: [number, number][];
  color: string;
  width: number;
  dashArray?: string;
  vehicleId: string;
  arrowEnd?: boolean;
  isSelected?: boolean;
}

export interface AnnotationData {
  id: string;
  text: string;
  position: [number, number];
  color: string;
}

export interface Circumstance {
  id: string;
  label: string;
  selected: boolean;
}

export interface DriverInfo {
  name: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseDate: string;
}

export interface InsuredInfo {
  name: string;
  phone: string;
  address: string;
}

// Ajout d'alias pour la compatibilité avec les anciennes références
export type Vehicle = VehicleSchemeData;
