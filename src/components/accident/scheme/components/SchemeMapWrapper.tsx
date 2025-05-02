
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import MapContainer from '../MapContainer';
import SchemeInfo from '../SchemeInfo';
import SchemeGuide from '../SchemeGuide';
import StepByStepGuide from '../StepByStepGuide';
import KeyboardShortcuts from '../KeyboardShortcuts';
import { Vehicle, Path, Annotation } from '../../types';

interface SchemeMapWrapperProps {
  center: [number, number];
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  currentPathPoints: [number, number][];
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  selectedVehicle: string | null;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  isEmpty: boolean;
  readOnly: boolean;
  onVehicleSelect: (id: string | null) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle: (id: string, degrees: number) => void;
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
  onRemoveAnnotation: (id: string) => void;
  onUpdateAnnotation: (id: string, text: string) => void;
  onMapReady: (map: L.Map) => void;
}

const SchemeMapWrapper: React.FC<SchemeMapWrapperProps> = ({
  center,
  vehicles,
  paths,
  annotations,
  currentPathPoints,
  drawingLayerRef,
  selectedVehicle,
  currentTool,
  isEmpty,
  readOnly,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onChangeVehicleType,
  onRemoveAnnotation,
  onUpdateAnnotation,
  onMapReady
}) => {
  return (
    <TooltipProvider>
      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
        <MapContainer 
          center={center}
          zoom={17}
          vehicles={vehicles}
          paths={paths}
          annotations={annotations}
          currentPathPoints={currentPathPoints}
          drawingLayerRef={drawingLayerRef}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={onVehicleSelect}
          onRemoveVehicle={onRemoveVehicle}
          onRotateVehicle={onRotateVehicle}
          onChangeVehicleType={onChangeVehicleType}
          onRemoveAnnotation={onRemoveAnnotation}
          onUpdateAnnotation={onUpdateAnnotation}
          onMapReady={onMapReady}
          readOnly={readOnly}
        />

        {/* Ajout des composants de guidance */}
        {!readOnly && (
          <>
            <SchemeGuide 
              currentTool={currentTool}
              isEmpty={isEmpty}
            />
            
            <StepByStepGuide 
              vehicleCount={vehicles.length}
              pathCount={paths.length}
              annotationCount={annotations.length}
            />
            
            <KeyboardShortcuts 
              selectedVehicle={selectedVehicle}
            />
          </>
        )}

        <SchemeInfo 
          vehicleCount={vehicles.length}
          pathCount={paths.length}
          annotationCount={annotations.length}
          isEmpty={isEmpty}
        />
      </div>
    </TooltipProvider>
  );
};

export default SchemeMapWrapper;
