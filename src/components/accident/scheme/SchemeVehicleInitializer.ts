
import { Vehicle } from '../types';
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
    brand: formData.vehicleBrand || undefined,
    model: formData.vehicleModel || undefined,
    rotation: 45, // 45 degrees
    isSelected: false,
    vehicleId: 'A',
    vehicleType: 'car'
  };
  
  // Vehicle B - slightly to the right of center
  const vehicleB: Vehicle = {
    id: uuidv4(),
    position: [center[0] + 0.0002, center[1] + 0.0002],
    color: '#e74c3c', // red
    brand: formData.otherVehicle?.brand || undefined,
    model: formData.otherVehicle?.model || undefined,
    rotation: 225, // 225 degrees (opposite direction)
    isSelected: false,
    vehicleId: 'B',
    vehicleType: 'car'
  };
  
  vehicles.push(vehicleA);
  vehicles.push(vehicleB);
  
  return vehicles;
};
