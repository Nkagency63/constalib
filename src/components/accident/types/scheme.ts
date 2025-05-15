
// Type definitions for scheme components

// Base vehicle type
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

// Base path type
export interface Path {
  id: string;
  points: [number, number][]; // Array of LatLng coordinates
  color: string;
  width: number;
  dashed: boolean;
  vehicleId?: string;
  isSelected?: boolean;
}

// Base annotation type
export interface Annotation {
  id: string;
  position: [number, number]; // LatLng coordinates
  text: string;
}

// Scheme data containing all elements
export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number]; // LatLng for the map center
  zoom: number;
}

// Re-export types with different names to avoid conflicts
export type SchemeVehicle = Vehicle;
export type SchemePath = Path;
export type SchemeAnnotation = Annotation;
export type SchemeDataType = SchemeData;
