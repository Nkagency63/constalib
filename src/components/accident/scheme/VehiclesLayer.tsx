
import React, { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { createCarIcon } from '@/utils/mapIcons';
import { Vehicle } from '../types';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Trash2, Car, Truck, Bike } from 'lucide-react';

interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  readOnly: boolean;
  onVehicleSelect: (id: string | null) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle?: (id: string, degrees: number) => void;
  onChangeVehicleType?: (type: 'car' | 'truck' | 'bike') => void;
}

const VehiclesLayer = ({
  vehicles,
  selectedVehicle,
  readOnly,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onChangeVehicleType
}: VehiclesLayerProps) => {
  const map = useMap();
  
  const handleRotate = (id: string, degrees: number) => {
    if (onRotateVehicle) {
      onRotateVehicle(id, degrees);
    }
  };

  const handleChangeVehicleType = (type: 'car' | 'truck' | 'bike') => {
    if (onChangeVehicleType) {
      onChangeVehicleType(type);
    }
  };

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  
  // Forcer un rafraîchissement de la carte lorsque les véhicules changent
  useEffect(() => {
    if (vehicles.length > 0) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [vehicles, map]);

  return (
    <>
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={vehicle.position}
          icon={createCarIcon(vehicle.color, vehicle.rotation, selectedVehicle === vehicle.id, vehicle.vehicleType)}
          eventHandlers={{
            click: () => !readOnly && onVehicleSelect(vehicle.id),
          }}
          draggable={!readOnly}
        >
          {/* Tooltip temporairement remplacé par un popup simple */}
          {vehicle.vehicleId && (
            <div className="sr-only">
              Véhicule {vehicle.vehicleId}
              {vehicle.brand && vehicle.model && ` (${vehicle.brand} ${vehicle.model})`}
            </div>
          )}
        </Marker>
      ))}

      {selectedVehicle && !readOnly && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-center space-x-2 border-b pb-2">
              <button
                onClick={() => handleChangeVehicleType('car')}
                className={`p-1 rounded-full hover:bg-gray-100 ${selectedVehicleData?.vehicleType === 'car' ? 'bg-blue-100 text-blue-700' : ''}`}
                title="Voiture"
              >
                <Car size={16} />
              </button>
              <button
                onClick={() => handleChangeVehicleType('truck')}
                className={`p-1 rounded-full hover:bg-gray-100 ${selectedVehicleData?.vehicleType === 'truck' ? 'bg-blue-100 text-blue-700' : ''}`}
                title="Camion"
              >
                <Truck size={16} />
              </button>
              <button
                onClick={() => handleChangeVehicleType('bike')}
                className={`p-1 rounded-full hover:bg-gray-100 ${selectedVehicleData?.vehicleType === 'bike' ? 'bg-blue-100 text-blue-700' : ''}`}
                title="Moto"
              >
                <Bike size={16} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRotate(selectedVehicle, -45)}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Tourner à gauche"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => handleRotate(selectedVehicle, -90)}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Tourner vers le haut"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => handleRotate(selectedVehicle, 90)}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Tourner vers le bas"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() => handleRotate(selectedVehicle, 45)}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Tourner à droite"
              >
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onRemoveVehicle(selectedVehicle)}
                className="p-1 rounded-full hover:bg-red-100 text-red-500"
                title="Supprimer le véhicule"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehiclesLayer;
