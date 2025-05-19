
import { useState, useEffect } from 'react';
import { Vehicle, SchemeData } from './accident/types/vehicleTypes';
import SchemeContainer from './accident/scheme/components/SchemeContainer';
import { Stage, Layer, Rect, Group } from 'react-konva';

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
        posX: 150,
        posY: 200,
        rotation: 0,
        width: 80,
        height: 40
      },
      {
        id: 'vehicle-b',
        type: 'B',
        posX: 250,
        posY: 300,
        rotation: 45,
        width: 80,
        height: 40
      }
    ]
  });

  const handleVehicleMove = (id: string, posX: number, posY: number) => {
    const updatedVehicles = schemeData.vehicles.map(vehicle => {
      if (vehicle.id === id) {
        return { ...vehicle, posX, posY };
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

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Schéma de l'accident</h3>
      <p className="text-sm text-gray-600 mb-4">
        Déplacez et tournez les véhicules pour représenter l'accident. 
        Le véhicule A est bleu, le véhicule B est rouge.
      </p>
      
      <SchemeContainer
        vehicles={schemeData.vehicles}
        onVehicleMove={handleVehicleMove}
        onVehicleRotate={handleVehicleRotate}
      />
    </div>
  );
};

export default VehicleScheme;
