
import { Vehicle } from '../types/scheme';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate random colors for vehicles
function getRandomColor(): string {
  const colors = [
    '#3498db', // blue
    '#e74c3c', // red
    '#2ecc71', // green
    '#f39c12', // orange
    '#9b59b6', // purple
    '#1abc9c', // teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

interface InitializeVehiclesProps {
  formData: any;
  vehiclesLength: number;
  setVehicles: (vehicles: Vehicle[]) => void;
  saveToHistory?: (state: any) => void;
}

export const initializeVehicles = ({ 
  formData, 
  vehiclesLength, 
  setVehicles, 
  saveToHistory 
}: InitializeVehiclesProps): boolean => {
  // Only initialize if no vehicles exist
  if (vehiclesLength === 0) {
    const vehicles = initializeVehiclesFromFormData(formData);
    setVehicles(vehicles);
    
    if (saveToHistory) {
      saveToHistory({
        vehicles,
        paths: [],
        annotations: [],
        center: formData?.geolocation?.lat && formData?.geolocation?.lng
          ? [formData.geolocation.lat, formData.geolocation.lng]
          : [48.8566, 2.3522],
        zoom: 17
      });
    }
    
    return true;
  }
  
  return false;
};

/**
 * Initializes default vehicles based on form data
 */
export const initializeVehiclesFromFormData = (formData: any): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  
  // Center coordinates from form data or default
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522]; // Paris coordinates
  
  // Vehicle A - slightly to the left of center
  const vehicleA: Vehicle = {
    id: uuidv4(),
    position: [center[0] - 0.0002, center[1] - 0.0002],
    color: '#3498db', // blue
    rotation: 45, // 45 degrees
    isSelected: false,
    type: 'car'
  };
  
  // Vehicle B - slightly to the right of center
  const vehicleB: Vehicle = {
    id: uuidv4(),
    position: [center[0] + 0.0002, center[1] + 0.0002],
    color: '#e74c3c', // red
    rotation: 225, // 225 degrees (opposite direction)
    isSelected: false,
    type: 'car'
  };
  
  vehicles.push(vehicleA);
  vehicles.push(vehicleB);
  
  return vehicles;
};
