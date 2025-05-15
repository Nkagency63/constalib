
import { Vehicle } from '../types/scheme';
import { v4 as uuidv4 } from 'uuid';

// Constants
const DEFAULT_CAR_POSITION: [number, number] = [48.8566, 2.3522];
const DEFAULT_OTHER_CAR_POSITION: [number, number] = [48.8568, 2.3528];

export const initializeVehicles = (formData: any): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  
  if (formData) {
    // Add main vehicle if data exists
    if (formData.vehicleBrand || formData.vehicleModel) {
      const vehicleA: Vehicle = {
        id: 'A',
        type: 'car',
        position: DEFAULT_CAR_POSITION,
        color: '#1e40af', // Blue for vehicle A
        rotation: 0,
        isSelected: false,
        label: 'A',
      };
      
      vehicles.push(vehicleA);
    }
    
    // Add other vehicle if data exists
    if (formData.otherVehicle?.brand || formData.otherVehicle?.model) {
      const vehicleB: Vehicle = {
        id: 'B',
        type: 'car',
        position: DEFAULT_OTHER_CAR_POSITION,
        color: '#dc2626', // Red for vehicle B
        rotation: 180, // Facing opposite direction
        isSelected: false,
        label: 'B',
      };
      
      vehicles.push(vehicleB);
    }
  }
  
  return vehicles;
};

export default initializeVehicles;
