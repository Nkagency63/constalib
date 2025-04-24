
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import AccidentMap from './AccidentMap';
import { Car } from 'lucide-react';

interface Vehicle {
  id: number;
  position: [number, number];
  type: 'A' | 'B';
}

const SchemeStep = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<'A' | 'B' | null>(null);

  const handleVehiclePlaced = (type: 'A' | 'B', position: [number, number]) => {
    const existingVehicleIndex = vehicles.findIndex(v => v.type === type);
    
    if (existingVehicleIndex !== -1) {
      // Update existing vehicle position
      setVehicles(vehicles.map((vehicle, index) => 
        index === existingVehicleIndex 
          ? { ...vehicle, position } 
          : vehicle
      ));
    } else {
      // Add new vehicle
      setVehicles([...vehicles, {
        id: Date.now(),
        position,
        type
      }]);
    }
    setSelectedVehicle(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Positionnez les véhicules sur la carte pour représenter l'accident.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedVehicle === 'A' ? "default" : "outline"}
          onClick={() => setSelectedVehicle('A')}
          className="flex items-center gap-2"
        >
          <Car className="h-4 w-4" />
          Véhicule A
        </Button>
        <Button
          variant={selectedVehicle === 'B' ? "default" : "outline"}
          onClick={() => setSelectedVehicle('B')}
          className="flex items-center gap-2"
        >
          <Car className="h-4 w-4" />
          Véhicule B
        </Button>
      </div>

      <div className="border rounded-lg p-1">
        <AccidentMap 
          vehicles={vehicles}
          onVehiclePlaced={handleVehiclePlaced}
          selectedVehicle={selectedVehicle}
        />
      </div>

      {selectedVehicle && (
        <p className="text-sm text-constalib-dark-gray text-center mt-2">
          Cliquez sur la carte pour placer le véhicule {selectedVehicle}
        </p>
      )}
    </div>
  );
};

export default SchemeStep;
