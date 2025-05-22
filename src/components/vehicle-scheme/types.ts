
export interface Vehicle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  label: string;
  mapLat?: number;
  mapLng?: number;
}

export interface MapMarker {
  id: string;
  type: 'arrow' | 'impact' | 'sign';
  lat: number;
  lng: number;
  rotation?: number;
  label?: string;
  details?: {
    signType?: 'stop' | 'light' | 'yield' | 'crossing';
    arrowType?: 'straight' | 'turn' | 'uturn';
    color?: string;
  };
}
