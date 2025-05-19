
import { Stage, Layer } from 'react-konva';
import { useState, useRef } from 'react';
import VehicleNode from './VehicleNode';
import { Vehicle } from '../../types/vehicleTypes';

interface SchemeContainerProps {
  vehicles: Vehicle[];
  onVehicleMove: (id: string, x: number, y: number) => void;
  onVehicleRotate: (id: string, rotation: number) => void;
}

const SchemeContainer = ({ vehicles, onVehicleMove, onVehicleRotate }: SchemeContainerProps) => {
  const stageRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const containerWidth = 500;
  const containerHeight = 500;
  
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };
  
  const handleDeselect = () => {
    setSelectedId(null);
  };

  return (
    <div className="scheme-container border border-gray-300 rounded-lg shadow-sm bg-white">
      <Stage
        ref={stageRef}
        width={containerWidth}
        height={containerHeight}
        onClick={(e) => {
          // Check if clicked on empty space
          if (e.target === e.currentTarget) {
            handleDeselect();
          }
        }}
        className="bg-gray-50"
      >
        <Layer>
          {/* Road markings (simple version) */}
          <VehicleNode
            key="road"
            id="road"
            x={containerWidth / 2}
            y={containerHeight / 2}
            width={400}
            height={4}
            rotation={0}
            color="gray"
            isSelected={false}
            isDraggable={false}
            onSelect={() => {}}
            onMove={() => {}}
            onRotate={() => {}}
          />
          <VehicleNode
            key="road-vertical"
            id="road-vertical"
            x={containerWidth / 2}
            y={containerHeight / 2}
            width={4}
            height={400}
            rotation={0}
            color="gray"
            isSelected={false}
            isDraggable={false}
            onSelect={() => {}}
            onMove={() => {}}
            onRotate={() => {}}
          />
          
          {/* Vehicles */}
          {vehicles.map((vehicle) => (
            <VehicleNode
              key={vehicle.id}
              id={vehicle.id}
              x={vehicle.posX}
              y={vehicle.posY}
              width={vehicle.width}
              height={vehicle.height}
              rotation={vehicle.rotation}
              color={vehicle.type === 'A' ? 'blue' : 'red'}
              isSelected={selectedId === vehicle.id}
              isDraggable
              onSelect={() => handleSelect(vehicle.id)}
              onMove={(x, y) => onVehicleMove(vehicle.id, x, y)}
              onRotate={(angle) => onVehicleRotate(vehicle.id, angle)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default SchemeContainer;
