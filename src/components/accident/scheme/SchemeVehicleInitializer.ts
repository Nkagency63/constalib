
import { Vehicle } from '../types';

interface VehicleInitializerProps {
  formData: any;
  vehiclesLength: number;
  setVehicles: (vehicles: Vehicle[]) => void;
  saveToHistory: (state: any) => void;
}

export const initializeVehicles = ({
  formData,
  vehiclesLength,
  setVehicles,
  saveToHistory
}: VehicleInitializerProps) => {
  if (!formData?.geolocation?.lat || !formData?.geolocation?.lng || vehiclesLength > 0) {
    return false;
  }

  const initialVehicles: Vehicle[] = [];
  
  // Add vehicle A if we have data
  if (formData.vehicleBrand && formData.vehicleModel) {
    initialVehicles.push({
      id: crypto.randomUUID(),
      position: [
        formData.geolocation.lat + 0.0002, 
        formData.geolocation.lng - 0.0002
      ],
      color: '#1e40af', // Bleu pour A
      brand: formData.vehicleBrand,
      model: formData.vehicleModel,
      vehicleId: 'A',
      rotation: 0,
      isSelected: false
    });
  }
  
  // Add vehicle B if we have data
  if (formData.otherVehicle?.brand && formData.otherVehicle?.model) {
    initialVehicles.push({
      id: crypto.randomUUID(),
      position: [
        formData.geolocation.lat - 0.0002, 
        formData.geolocation.lng + 0.0002
      ],
      color: '#dc2626', // Rouge pour B
      brand: formData.otherVehicle.brand,
      model: formData.otherVehicle.model,
      vehicleId: 'B',
      rotation: 0,
      isSelected: false
    });
  }
  
  // Set initial vehicles if we have any
  if (initialVehicles.length > 0) {
    setVehicles(initialVehicles);
    saveToHistory({
      vehicles: initialVehicles,
      paths: [],
      annotations: [],
      center: [formData.geolocation.lat, formData.geolocation.lng],
      zoom: 17
    });
    
    return true;
  }
  
  return false;
};
