
import L from 'leaflet';
import { v4 as uuidv4 } from 'uuid';

interface SchemeMapHandlersProps {
  readOnly: boolean;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  vehicles: any[];
  paths: any[];
  annotations: any[];
  selectedVehicle: string | null;
  isDrawing: boolean;
  centerOnVehicles: () => void;
  saveToHistory: () => any;
  addVehicle: (latlng: L.LatLng) => any;
  selectVehicle: (id: string | null) => void;
  startPath: (point: [number, number]) => void;
  continuePath: (point: [number, number]) => void;
  addAnnotation: (point: [number, number]) => any;
}

export const handleMapClick = (e: L.LeafletMouseEvent, props: SchemeMapHandlersProps) => {
  const { readOnly, currentTool, addVehicle, startPath, addAnnotation } = props;
  
  if (readOnly) return;
  
  // Get the clicked coordinates
  const latlng = e.latlng;
  
  // Handle the click depending on the active tool
  switch (currentTool) {
    case 'vehicle':
      // Add a vehicle at the clicked location
      addVehicle(latlng);
      break;
      
    case 'path':
      // Start a new path at the clicked location
      startPath([latlng.lat, latlng.lng]);
      break;
      
    case 'annotation':
      // Add an annotation at the clicked location
      addAnnotation([latlng.lat, latlng.lng]);
      break;
      
    case 'select':
    default:
      // Default behavior is to do nothing or deselect
      break;
  }
};
