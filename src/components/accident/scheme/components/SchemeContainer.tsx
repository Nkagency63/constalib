
import React, { useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { toast } from 'sonner';
import { VehicleSchemeData } from '../../types/types';
import VehicleShape from './VehicleShape';

interface SchemeContainerProps {
  vehicles: VehicleSchemeData[];
  onVehicleMove: (id: string, x: number, y: number) => void;
  onVehicleRotate: (id: string, rotation: number) => void;
  width?: number;
  height?: number;
}

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  vehicles = [],
  onVehicleMove,
  onVehicleRotate,
  width = 500,
  height = 500,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const checkDeselect = (e: any) => {
    // Désélectionner si on clique sur le fond du canvas
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleVehicleChange = (id: string, newProps: { x?: number; y?: number; rotation?: number }) => {
    if (newProps.x !== undefined && newProps.y !== undefined) {
      onVehicleMove(id, newProps.x, newProps.y);
    }
    
    if (newProps.rotation !== undefined) {
      onVehicleRotate(id, newProps.rotation);
    }
  };

  return (
    <div className="scheme-container border border-gray-300 rounded-lg shadow-sm bg-white">
      <Stage
        width={width}
        height={height}
        onClick={checkDeselect}
        onTap={checkDeselect}
        className="bg-gray-50"
      >
        <Layer>
          {/* Fond de carte avec routes */}
          <Rect x={0} y={0} width={width} height={height} fill="#f3f4f6" />
          
          {/* Route horizontale */}
          <Rect x={50} y={height/2 - 15} width={width - 100} height={30} fill="#e0e0e0" />
          
          {/* Route verticale */}
          <Rect x={width/2 - 15} y={50} width={30} height={height - 100} fill="#e0e0e0" />
          
          {/* Lignes de route */}
          <Line
            points={[50, height/2, width - 50, height/2]}
            stroke="#ffffff"
            strokeWidth={2}
            dash={[15, 10]}
          />
          
          <Line
            points={[width/2, 50, width/2, height - 50]}
            stroke="#ffffff"
            strokeWidth={2}
            dash={[15, 10]}
          />

          {/* Véhicules */}
          {vehicles.map((vehicle) => {
            // Convertir position [lat, lng] en x, y pour Konva ou utiliser x, y s'ils existent
            const vehicleX = vehicle.x !== undefined ? vehicle.x : (vehicle.position ? vehicle.position[1] * 10 : width / 2);
            const vehicleY = vehicle.y !== undefined ? vehicle.y : (vehicle.position ? vehicle.position[0] * 10 : height / 2);
            
            return (
              <VehicleShape
                key={vehicle.id}
                id={vehicle.id}
                x={vehicleX}
                y={vehicleY}
                width={vehicle.width || 80}
                height={vehicle.height || 40}
                rotation={vehicle.rotation || 0}
                color={vehicle.color || (vehicle.type === 'A' ? 'blue' : 'red')}
                label={vehicle.label || vehicle.type}
                isSelected={selectedId === vehicle.id}
                onSelect={() => handleSelect(vehicle.id)}
                onChange={(newProps) => handleVehicleChange(vehicle.id, newProps)}
                onTransformEnd={() => {
                  toast("Position mise à jour", { duration: 1000 });
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default SchemeContainer;
