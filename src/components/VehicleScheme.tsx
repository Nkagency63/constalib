
import { useState, useEffect } from 'react';
import { SchemeData, VehicleSchemeData } from './accident/types/types';
import SchemeContainer from './accident/scheme/components/SchemeContainer';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface VehicleSchemeProps {
  initialData?: SchemeData | null;
  onSchemeUpdate?: (data: SchemeData) => void;
}

const VehicleScheme = ({ initialData, onSchemeUpdate }: VehicleSchemeProps) => {
  const [schemeData, setSchemeData] = useState<SchemeData>({
    vehicles: initialData?.vehicles || [
      {
        id: 'vehicle-a',
        type: 'A',
        position: [200, 150],
        x: 200,
        y: 150,
        rotation: 0,
        width: 80,
        height: 40,
        color: '#3b82f6',
        label: 'Véhicule A'
      },
      {
        id: 'vehicle-b',
        type: 'B',
        position: [300, 250],
        x: 300,
        y: 250,
        rotation: 45,
        width: 80,
        height: 40,
        color: '#ef4444',
        label: 'Véhicule B'
      }
    ],
    paths: initialData?.paths || [],
    annotations: initialData?.annotations || [],
    center: initialData?.center || [50, 50],
    zoom: initialData?.zoom || 1
  });

  useEffect(() => {
    // Update scheme with initialData if provided and not already set
    if (initialData && 
        initialData.vehicles && 
        initialData.vehicles.length > 0 && 
        (!schemeData.vehicles || schemeData.vehicles.length === 0)) {
      console.log("Updating VehicleScheme with initialData", initialData);
      setSchemeData(initialData);
    }
  }, [initialData]);

  const handleVehicleMove = (id: string, x: number, y: number) => {
    const updatedVehicles = schemeData.vehicles.map(vehicle => {
      if (vehicle.id === id) {
        return { 
          ...vehicle, 
          x, 
          y, 
          position: [x, y] as [number, number]  // Update position for compatibility with map
        };
      }
      return vehicle;
    });
    
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
  };
  
  const handleVehicleRotate = (id: string, rotation: number) => {
    const updatedVehicles = schemeData.vehicles.map(vehicle => {
      if (vehicle.id === id) {
        return { ...vehicle, rotation };
      }
      return vehicle;
    });
    
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
  };
  
  const addVehicle = () => {
    if (schemeData.vehicles.length >= 4) {
      toast("Maximum de 4 véhicules atteint");
      return;
    }
    
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
    const newVehicle: VehicleSchemeData = {
      id: uuidv4(),
      type: `${String.fromCharCode(65 + schemeData.vehicles.length)}`, // A, B, C, D, etc.
      position: [200, 200], // Default position
      x: 200,
      y: 200,
      rotation: 0,
      width: 80,
      height: 40,
      color: colors[schemeData.vehicles.length % colors.length],
      label: `Véhicule ${String.fromCharCode(65 + schemeData.vehicles.length)}`
    };
    
    const updatedVehicles = [...schemeData.vehicles, newVehicle];
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
    
    toast(`Véhicule ${newVehicle.type} ajouté`);
  };
  
  const removeVehicle = (id: string) => {
    const vehicleToRemove = schemeData.vehicles.find(v => v.id === id);
    const updatedVehicles = schemeData.vehicles.filter(vehicle => vehicle.id !== id);
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
    
    if (vehicleToRemove) {
      toast(`Véhicule ${vehicleToRemove.type} supprimé`);
    }
  };

  return (
    <div className="w-full h-full">
      <SchemeContainer
        vehicles={schemeData.vehicles}
        onVehicleMove={handleVehicleMove}
        onVehicleRotate={handleVehicleRotate}
        onAddVehicle={addVehicle}
        onRemoveVehicle={removeVehicle}
        width={500}
        height={500}
      />
    </div>
  );
};

export default VehicleScheme;
