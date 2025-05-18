
import React from 'react';
import SchemeToolbars from './SchemeToolbars';
import SchemeMapWrapper from './SchemeMapWrapper';
import { SchemeData, GeolocationData } from '../../types';
import 'leaflet/dist/leaflet.css';

interface SchemeContentProps {
  // Map state
  mapCenter: [number, number];
  mapZoom: number;
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  
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
  handleMapReadyFromHook: (map: L.Map) => void;
  handleCenterOnVehicles: () => void;
  
  // Read-only state
  readOnly: boolean;
  
  // Map refs
  mapRef: React.MutableRefObject<L.Map | null>;
  
  // Geolocation data
  geolocationData?: GeolocationData;
}

const SchemeContent: React.FC<SchemeContentProps> = ({
  // Map state
  mapCenter,
  drawingLayerRef,
  
  // UI state
  currentTool,
  setCurrentTool,
  pathColor,
  setPathColor,
  isEmpty,
  
  // Hooks data and methods
  vehicles,
  setVehicles,
  selectedVehicle,
  currentVehicleType,
  onChangeVehicleType,
  selectVehicle,
  removeVehicle,
  rotateVehicle,
  
  paths,
  setPaths,
  currentPathPoints,
  
  annotations,
  setAnnotations,
  updateAnnotation,
  removeAnnotation,
  
  // Handlers
  handleMapReadyFromHook,
  handleCenterOnVehicles,
  
  // Read-only state
  readOnly,
  
  // Map refs
  mapRef,
  
  // Geolocation data
  geolocationData
}) => {
  // Log pour déboguer
  console.log('SchemeContent rendering with mapCenter:', mapCenter);
  
  return (
    <div className="scheme-container h-full flex flex-col">
      <SchemeToolbars 
        readOnly={readOnly}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        onAddVehicle={() => {}}
        canUndo={false} // We'll implement history later
        canRedo={false}
        vehicles={vehicles}
        paths={paths}
        annotations={annotations}
        handleUndo={() => {}}
        handleRedo={() => {}}
        setVehicles={setVehicles}
        setPaths={setPaths}
        setAnnotations={setAnnotations}
        centerOnVehicles={handleCenterOnVehicles}
        mapRef={mapRef}
        currentVehicleType={currentVehicleType}
        onChangeVehicleType={onChangeVehicleType}
        activeTab="vehicles" // Default to vehicles tab
        setActiveTab={() => {}} // No-op since we're not using tabs in this implementation
        pathColor={pathColor}
        setPathColor={setPathColor}
      />
      
      <div className="flex-1 relative h-[400px]">
        <SchemeMapWrapper
          center={mapCenter}
          vehicles={vehicles}
          paths={paths}
          annotations={annotations}
          currentPathPoints={currentPathPoints}
          drawingLayerRef={drawingLayerRef}
          selectedVehicle={selectedVehicle}
          currentTool={currentTool}
          isEmpty={isEmpty}
          readOnly={readOnly}
          onVehicleSelect={selectVehicle}
          onRemoveVehicle={removeVehicle}
          onRotateVehicle={rotateVehicle}
          onChangeVehicleType={onChangeVehicleType}
          onRemoveAnnotation={removeAnnotation}
          onUpdateAnnotation={updateAnnotation}
          onMapReady={handleMapReadyFromHook}
          geolocationData={geolocationData}
        />
      </div>
    </div>
  );
};

export default SchemeContent;
