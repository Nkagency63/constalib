
import { Vehicle } from '../types/scheme';
import { v4 as uuidv4 } from 'uuid';

// Constants
const DEFAULT_CAR_POSITION: [number, number] = [48.8566, 2.3522];
const DEFAULT_OTHER_CAR_POSITION: [number, number] = [48.8568, 2.3528];

// Colors for vehicles
const VEHICLE_A_COLOR = '#1e40af'; // Blue
const VEHICLE_B_COLOR = '#dc2626'; // Red
const ADDITIONAL_VEHICLE_COLORS = ['#10b981', '#f59e0b', '#6366f1']; // Green, Orange, Purple

export const initializeVehicles = (formData: any): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  
  // If we have geolocation, use it as a base position
  let basePosition: [number, number] = DEFAULT_CAR_POSITION;
  if (formData?.geolocation?.lat && formData?.geolocation?.lng) {
    basePosition = [formData.geolocation.lat, formData.geolocation.lng];
  }

  // Create offset positions around the base location
  const offsetLat = 0.0002; // Small latitude offset
  const offsetLng = 0.0006; // Small longitude offset
  
  // Add vehicle A (main vehicle)
  const vehicleA: Vehicle = {
    id: 'A',
    type: 'car',
    position: [basePosition[0] - offsetLat, basePosition[1] - offsetLng],
    color: VEHICLE_A_COLOR,
    rotation: 0,
    isSelected: false,
    label: 'A'
  };
  vehicles.push(vehicleA);
  
  // Add vehicle B (other vehicle)
  const vehicleB: Vehicle = {
    id: 'B',
    type: 'car',
    position: [basePosition[0] + offsetLat, basePosition[1] + offsetLng],
    color: VEHICLE_B_COLOR,
    rotation: 180, // Facing opposite direction by default
    isSelected: false,
    label: 'B'
  };
  vehicles.push(vehicleB);
  
  return vehicles;
};

export default initializeVehicles;
