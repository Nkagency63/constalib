
import { SchemeData as BaseSchemeData } from '../types';

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

// Export for backward compatibility
