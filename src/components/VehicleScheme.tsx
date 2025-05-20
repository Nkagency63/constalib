
import { useState, useEffect } from 'react';
import { SchemeData, VehicleSchemeData } from './accident/types/types';
import SchemeContainer from './accident/scheme/components/SchemeContainer';
import { v4 as uuidv4 } from 'uuid';

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

  const handleVehicleMove = (id: string, x: number, y: number) => {
    const updatedVehicles = schemeData.vehicles.map(vehicle => {
      if (vehicle.id === id) {
        return { 
          ...vehicle, 
          x, 
          y, 
          position: [x, y] as [number, number]  // Mise à jour de la position compatible avec la carte
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
    if (schemeData.vehicles.length >= 4) return; // Maximum 4 véhicules
    
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
    const newVehicle: VehicleSchemeData = {
      id: uuidv4(),
      type: `${String.fromCharCode(65 + schemeData.vehicles.length)}`, // A, B, C, D, etc.
      position: [200, 200], // Position par défaut
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
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Schéma de l'accident</h3>
      <p className="text-sm text-gray-600 mb-4">
        Déplacez et tournez les véhicules pour représenter l'accident.
      </p>
      
      <div className="mb-4">
        <button 
          onClick={addVehicle}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={schemeData.vehicles.length >= 4}
        >
          + Ajouter un véhicule
        </button>
      </div>
      
      <SchemeContainer
        vehicles={schemeData.vehicles}
        onVehicleMove={handleVehicleMove}
        onVehicleRotate={handleVehicleRotate}
      />
    </div>
  );
};

export default VehicleScheme;
