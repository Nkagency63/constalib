
// Base types for accident scheme elements

export interface Vehicle {
  id: string;
  position: [number, number];
  type: 'car' | 'truck' | 'bike';
  color: string;
  rotation: number;
  label?: string;
  isSelected?: boolean;
}

export interface Path {
  id: string;
  points: [number, number][];
  color: string;
  width?: number;
  dashed?: boolean;
  isSelected?: boolean;
}

export interface Annotation {
  id: string;
  position: [number, number];
  text: string;
  isSelected?: boolean;
}

export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center?: [number, number];
  zoom?: number;
}

// Export the modified type definitions
export type { Vehicle, Path, Annotation, SchemeData };
