
export interface Vehicle {
  id: string;
  position: [number, number];
  color: string;
  brand?: string;
  model?: string;
  rotation: number;
  isSelected: boolean;
}

export interface Path {
  id: string;
  points: [number, number][];
  color: string;
  vehicleId?: string;
  isSelected: boolean;
}

export interface Annotation {
  id: string;
  position: [number, number];
  text: string;
  type: 'obstacle' | 'sign' | 'note';
}

export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number];
  zoom: number;
}
