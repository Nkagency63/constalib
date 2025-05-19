
import React from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { GeolocationData } from '../../types';
import VehicleNode from './VehicleNode';
import { Button } from '@/components/ui/button';
import { Car, RotateCw, Trash2 } from 'lucide-react';

interface SchemeContentProps {
  // Map state
  mapCenter: [number, number];
  mapZoom: number;
  drawingLayerRef: React.MutableRefObject<any>;
  
  // UI state
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  setCurrentTool: (tool: 'select' | 'vehicle' | 'path' | 'annotation') => void;
  pathColor: string;
  setPathColor: (color: string) => void;
  isEmpty: boolean;
  
  // Hooks data and methods
  vehicles: any[];
  setVehicles: (vehicles: any[]) => void;
  selectedVehicle: string | null;
  currentVehicleType: 'car' | 'truck' | 'bike';
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
  selectVehicle: (id: string) => void;
  removeVehicle: (id: string) => void;
  rotateVehicle: (id: string, degrees: number) => void;
  
  paths: any[];
  setPaths: (paths: any[]) => void;
  currentPathPoints: [number, number][];
  
  annotations: any[];
  setAnnotations: (annotations: any[]) => void;
  updateAnnotation: (id: string, text: string) => void;
  removeAnnotation: (id: string) => void;
  
  // Handlers
  handleMapReadyFromHook: (map: any) => void;
  handleCenterOnVehicles: () => void;
  
  // Read-only state
  readOnly: boolean;
  
  // Map refs
  mapRef: React.MutableRefObject<any>;
  
  // Geolocation data
  geolocationData?: GeolocationData;
}

const SchemeContent: React.FC<SchemeContentProps> = ({
  // Hooks data and methods
  vehicles,
  setVehicles,
  selectedVehicle,
  selectVehicle,
  removeVehicle,
  rotateVehicle,
  
  // UI state
  currentTool,
  setCurrentTool,
  
  // Read-only state
  readOnly
}) => {
  const stageWidth = 500;
  const stageHeight = 500;
  
  const handleVehicleChange = (updatedVehicle: any) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    );
    setVehicles(updatedVehicles);
  };
  
  const handleAddVehicle = () => {
    const newVehicle = {
      id: `vehicle-${Date.now()}`,
      type: 'car',
      position: [0, 0], // We'll convert this for Konva
      x: stageWidth / 2 - 40,
      y: stageHeight / 2 - 20,
      width: 80,
      height: 40,
      rotation: 0,
      color: 'blue',
      label: `Véhicule ${vehicles.length + 1}`,
      isSelected: false
    };
    
    setVehicles([...vehicles, newVehicle]);
    selectVehicle(newVehicle.id);
  };
  
  const handleStageClick = (e: any) => {
    // Deselect when clicking on empty canvas
    if (e.target === e.currentTarget) {
      selectVehicle('');
    }
  };
  
  return (
    <div className="scheme-container h-full flex flex-col">
      <div className="bg-white p-2 border-b flex items-center space-x-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddVehicle}
          disabled={readOnly}
        >
          <Car className="h-4 w-4 mr-1" /> Ajouter un véhicule
        </Button>
        
        {selectedVehicle && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => rotateVehicle(selectedVehicle, 15)}
              disabled={readOnly}
            >
              <RotateCw className="h-4 w-4 mr-1" /> Pivoter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeVehicle(selectedVehicle)}
              disabled={readOnly}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Supprimer
            </Button>
          </>
        )}
      </div>
      
      <div className="flex-1 relative border rounded-md overflow-hidden" style={{ height: stageHeight }}>
        <Stage 
          width={stageWidth} 
          height={stageHeight} 
          onClick={handleStageClick}
          className="bg-gray-100"
        >
          <Layer>
            {vehicles.map(vehicle => (
              <VehicleNode
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={vehicle.id === selectedVehicle}
                onChange={handleVehicleChange}
                onClick={() => selectVehicle(vehicle.id)}
                readOnly={readOnly}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SchemeContent;
