
// S'il y a déjà un fichier types.ts, assurez-vous de ne pas écraser les définitions existantes
// Complétez ou modifiez seulement ce qui est nécessaire

export interface Vehicle {
  id: string;
  position: [number, number];
  rotation: number;
  color: string;
  type: 'car' | 'truck' | 'bike';
  label?: string;
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

export interface FormData {
  // Ajoutez ici les propriétés du formulaire d'accident
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  geolocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  [key: string]: any; // Pour permettre d'autres propriétés
}
