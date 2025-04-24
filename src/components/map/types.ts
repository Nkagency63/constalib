
import L from 'leaflet';

export interface Vehicle {
  id: string;
  position: L.LatLng;
  rotation: number;
  color: string;
  label: string;
}
