
export interface Vehicle {
  id: string;
  position: [number, number];
  color: string;
  brand?: string;
  model?: string;
  rotation: number;
  isSelected: boolean;
  type: 'car' | 'truck' | 'bike';
}

export interface Path {
  id: string;
  points: [number, number][]; // Array of LatLng coordinates
  color: string;
  width?: number;
  dashed?: boolean;
  isSelected: boolean;
}

export interface Annotation {
  id: string;
  position: [number, number];
  text: string;
  type?: 'obstacle' | 'sign' | 'note';
}

export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number]; // LatLng for the map center
  zoom: number;
}
