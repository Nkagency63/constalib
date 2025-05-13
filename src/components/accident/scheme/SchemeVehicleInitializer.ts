
import { Vehicle } from '../types/scheme';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CAR_SCALE = 1.0;
const DEFAULT_TRUCK_SCALE = 1.2;
const DEFAULT_BIKE_SCALE = 0.7;

// Define a record of available vehicle colors
export const VEHICLE_COLORS: Record<string, string> = {
  A: '#007bff', // Blue for vehicle A
  B: '#dc3545', // Red for vehicle B
  C: '#28a745', // Green for vehicle C
  D: '#ffc107', // Yellow for vehicle D
  E: '#6f42c1', // Purple for vehicle E
  F: '#fd7e14', // Orange for vehicle F
};

/**
 * Initialize vehicles based on form data
 * @param formData The form data containing vehicle info
 * @param mapCenter The center coordinates of the map
 * @returns Array of initialized vehicles
 */
export const initializeVehicles = (
  formData: any,
  mapCenter: [number, number] = [48.8566, 2.3522]
): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  
  // Initialize Vehicle A (shifted slightly left from center)
  vehicles.push({
    id: uuidv4(),
    position: [mapCenter[0] - 0.0002, mapCenter[1] - 0.0002],
    type: 'car',
    color: VEHICLE_COLORS.A,
    rotation: 0,
    label: 'A',
    isSelected: false
  });
  
  // Initialize Vehicle B if we have otherVehicle data (shifted slightly right)
  if (formData?.otherVehicle?.brand) {
    vehicles.push({
      id: uuidv4(),
      position: [mapCenter[0] + 0.0002, mapCenter[1] + 0.0002],
      type: 'car',
      color: VEHICLE_COLORS.B,
      rotation: 180, // Facing the opposite direction
      label: 'B',
      isSelected: false
    });
  }
  
  return vehicles;
};

/**
 * Create a new vehicle with default properties
 * @param position Position on the map [lat, lng]
 * @param type The type of vehicle to create
 * @param label Optional label for the vehicle
 * @returns New vehicle object
 */
export const createVehicle = (
  position: [number, number], 
  type: 'car' | 'truck' | 'bike' = 'car',
  label?: string
): Vehicle => {
  // Get the next letter for labeling if not provided
  if (!label) {
    label = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F
  }
  
  return {
    id: uuidv4(),
    position,
    type,
    color: VEHICLE_COLORS[label] || '#999999',
    rotation: 0,
    label,
    isSelected: false
  };
};

export default {
  initializeVehicles,
  createVehicle
};
