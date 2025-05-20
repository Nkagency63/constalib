
import React, { useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import VehicleNode from './VehicleNode';
import { VehicleSchemeData } from '../../types/types';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, Plus, Trash } from 'lucide-react';

interface SchemeContainerProps {
  vehicles: VehicleSchemeData[];
  onVehicleMove: (id: string, x: number, y: number) => void;
  onVehicleRotate: (id: string, rotation: number) => void;
  width?: number;
  height?: number;
  onAddVehicle?: () => void;
  onRemoveVehicle?: (id: string) => void;
}

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  vehicles = [],
  onVehicleMove,
  onVehicleRotate,
  width = 500,
  height = 500,
  onAddVehicle,
  onRemoveVehicle
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const checkDeselect = (e: any) => {
    // Deselect if clicking on empty canvas
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
    if (!selectedId) return;
    
    const vehicle = vehicles.find(v => v.id === selectedId);
    if (!vehicle) return;
    
    const delta = direction === 'clockwise' ? 15 : -15;
    const newRotation = (vehicle.rotation || 0) + delta;
    
    onVehicleRotate(selectedId, newRotation);
  };

  return (
    <div className="scheme-container space-y-3">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddVehicle}
          disabled={!onAddVehicle || vehicles.length >= 4}
        >
          <Plus className="h-4 w-4 mr-1" /> Ajouter véhicule
        </Button>

        {selectedId && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleRotate('counterclockwise')}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleRotate('clockwise')}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            {onRemoveVehicle && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700" 
                onClick={() => {
                  onRemoveVehicle(selectedId);
                  setSelectedId(null);
                }}
              >
                <Trash className="h-4 w-4 mr-1" /> Supprimer
              </Button>
            )}
          </>
        )}
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Stage
          width={width}
          height={height}
          onClick={checkDeselect}
          onTap={checkDeselect}
          className="bg-gray-100"
        >
          <Layer>
            {/* Background with roads */}
            {/* Horizontal road */}
            <Rect
              x={50}
              y={height/2 - 15}
              width={width - 100}
              height={30}
              fill="#e0e0e0"
            />
            
            {/* Vertical road */}
            <Rect
              x={width/2 - 15}
              y={50}
              width={30}
              height={height - 100}
              fill="#e0e0e0"
            />
            
            {/* Road lines */}
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
            
            {/* Render vehicles */}
            {Array.isArray(vehicles) && vehicles.map((vehicle) => {
              if (!vehicle || !vehicle.id) {
                console.warn('Vehicle with missing id detected');
                return null;
              }
              
              return (
                <VehicleNode
                  key={vehicle.id}
                  id={vehicle.id}
                  x={vehicle.x !== undefined ? vehicle.x : width / 2}
                  y={vehicle.y !== undefined ? vehicle.y : height / 2}
                  width={vehicle.width || 80}
                  height={vehicle.height || 40}
                  rotation={vehicle.rotation || 0}
                  color={vehicle.color || (vehicle.type === 'A' ? '#3b82f6' : '#ef4444')}
                  label={vehicle.label || `Véhicule ${vehicle.type || ''}`}
                  isSelected={selectedId === vehicle.id}
                  isDraggable={true}
                  onSelect={() => handleSelect(vehicle.id)}
                  onMove={(x, y) => onVehicleMove(vehicle.id, x, y)}
                  onRotate={(angle) => onVehicleRotate(vehicle.id, angle)}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SchemeContainer;
