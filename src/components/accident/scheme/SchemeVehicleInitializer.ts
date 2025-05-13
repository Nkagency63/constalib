
import { Vehicle } from '../types';
import { VEHICLE_COLORS } from '../hooks/useVehicles';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface InitializeVehiclesProps {
  formData: any;
  vehiclesLength: number;
  setVehicles: (vehicles: Vehicle[]) => void;
  saveToHistory: (state: any) => void;
}

// Fonction pour initialiser les véhicules à partir des données de formulaire
export const initializeVehicles = ({
  formData,
  vehiclesLength,
  setVehicles,
  saveToHistory
}: InitializeVehiclesProps): boolean => {
  // Si des véhicules existent déjà, ne pas initialiser
  if (vehiclesLength > 0) {
    return false;
  }
  
  try {
    // Vérifier si nous avons des informations sur les véhicules
    if (formData?.vehicleBrand && formData?.otherVehicle?.brand) {
      console.log("Initializing vehicles from form data:", formData.vehicleBrand, formData.otherVehicle.brand);
      
      // Coordonnées par défaut basées sur la géolocalisation ou Paris si non disponible
      const lat = formData.geolocation?.lat || 48.8566;
      const lng = formData.geolocation?.lng || 2.3522;
      
      // Créer le premier véhicule (A)
      const vehicleA: Vehicle = {
        id: uuidv4(),
        position: [lat, lng - 0.0003],
        color: VEHICLE_COLORS.A,
        vehicleId: 'A',
        rotation: 0,
        isSelected: true,
        vehicleType: 'car',
        brand: formData.vehicleBrand,
        model: formData.vehicleModel
      };
      
      // Créer le second véhicule (B)
      const vehicleB: Vehicle = {
        id: uuidv4(),
        position: [lat, lng + 0.0003],
        color: VEHICLE_COLORS.B,
        vehicleId: 'B',
        rotation: 180, // Orienté dans l'autre sens
        isSelected: false,
        vehicleType: 'car',
        brand: formData.otherVehicle.brand,
        model: formData.otherVehicle.model
      };
      
      // Mettre à jour l'état des véhicules
      const newVehicles = [vehicleA, vehicleB];
      setVehicles(newVehicles);
      
      // Sauvegarder dans l'historique
      saveToHistory({
        vehicles: newVehicles,
        paths: [],
        annotations: [],
        center: [lat, lng],
        zoom: 18
      });
      
      toast.success('Véhicules initialisés à partir des données du formulaire');
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error initializing vehicles:", error);
    toast.error("Erreur lors de l'initialisation des véhicules");
    return false;
  }
};
