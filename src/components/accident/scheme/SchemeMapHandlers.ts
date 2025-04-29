
import { Vehicle, Path, Annotation } from '../types';
import { toast } from 'sonner';

interface MapHandlersProps {
  readOnly: boolean;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  selectedVehicle: string | null;
  isDrawing: boolean;
  centerOnVehicles: (vehicles: Vehicle[]) => void;
  saveToHistory: (state: any) => any;
  addVehicle: (latlng: L.LatLng) => Vehicle[] | null;
  selectVehicle: (id: string | null) => void;
  startPath: (point: [number, number], vehicleId?: string, color?: string | null) => void;
  continuePath: (point: [number, number]) => void;
  addAnnotation: (point: [number, number]) => Annotation[];
}

// Handle clicks on the map based on the selected tool
export const handleMapClick = (
  e: L.LeafletMouseEvent,
  {
    readOnly,
    currentTool,
    vehicles,
    paths,
    annotations,
    selectedVehicle,
    isDrawing,
    centerOnVehicles,
    saveToHistory,
    addVehicle,
    selectVehicle,
    startPath,
    continuePath,
    addAnnotation
  }: MapHandlersProps
) => {
  if (readOnly) return;
  
  const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
  
  switch (currentTool) {
    case 'vehicle':
      if (vehicles.length < 4) {
        const updatedVehicles = addVehicle(e.latlng);
        if (updatedVehicles) {
          saveToHistory({ 
            vehicles: updatedVehicles, 
            paths, 
            annotations, 
            center: [e.latlng.lat, e.latlng.lng],
            zoom: 17 
          });
          // Auto-center on vehicles when a new one is added
          centerOnVehicles(updatedVehicles);
        }
      } else {
        toast.warning("Maximum de 4 véhicules atteint");
      }
      break;
      
    case 'path':
      if (isDrawing) {
        continuePath(newPoint);
      } else if (selectedVehicle) {
        // Start drawing a path from the selected vehicle
        const vehicle = vehicles.find(v => v.id === selectedVehicle);
        if (vehicle) {
          startPath(vehicle.position, vehicle.id, vehicle.color);
        }
      } else {
        startPath(newPoint);
      }
      break;
      
    case 'annotation':
      const updatedAnnotations = addAnnotation(newPoint);
      saveToHistory({
        vehicles,
        paths,
        annotations: updatedAnnotations,
        center: [e.latlng.lat, e.latlng.lng],
        zoom: 17
      });
      break;
      
    case 'select':
    default:
      // In select mode, deselect current vehicle
      selectVehicle(null);
      break;
  }
};
