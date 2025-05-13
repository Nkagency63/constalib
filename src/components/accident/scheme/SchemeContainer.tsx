
import React, { useState, useEffect } from 'react';
import { SchemeData } from '../types';
import MapContainer from './MapContainer';
import SchemeToolbars from './components/SchemeToolbars';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';
import { SchemeToolbarsProps } from '../types/props';

interface SchemeContainerProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
}

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'paths' | 'annotations'>('vehicles');
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [pathColor, setPathColor] = useState<string>('#ff0000');
  const [isTilting, setIsTilting] = useState<boolean>(false);

  const vehiclesHook = useVehicles();
  const pathsHook = usePaths();
  const annotationsHook = useAnnotations();
  
  // Initialize with initial data if provided
  useEffect(() => {
    if (initialData) {
      if (initialData.vehicles) {
        vehiclesHook.setVehicles(initialData.vehicles);
      }
      if (initialData.center) {
        setMapCenter(initialData.center);
      }
      if (initialData.zoom) {
        setMapZoom(initialData.zoom);
      }
    }
  }, [initialData]);

  // Update parent with current scheme data
  useEffect(() => {
    const updateCallback = onUpdateSchemeData || onSchemeUpdate;
    if (updateCallback) {
      const currentData: SchemeData = {
        vehicles: vehiclesHook.vehicles,
        paths: pathsHook.paths,
        annotations: annotationsHook.annotations,
        center: mapCenter,
        zoom: mapZoom,
      };
      updateCallback(currentData);
    }
  }, [vehiclesHook.vehicles, pathsHook.paths, annotationsHook.annotations, mapCenter, mapZoom, onUpdateSchemeData, onSchemeUpdate]);

  // Handler for adding a vehicle
  const handleAddVehicle = () => {
    // Default center of the map
    const position: [number, number] = [mapCenter[0], mapCenter[1]];
    vehiclesHook.addVehicle(position, vehiclesHook.currentVehicleType);
  };

  return (
    <div className="scheme-container h-full flex flex-col">
      <SchemeToolbars 
        readOnly={readOnly}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        onAddVehicle={handleAddVehicle}
        canUndo={false}
        canRedo={false}
        vehicles={vehiclesHook.vehicles}
        paths={pathsHook.paths}
        annotations={annotationsHook.annotations}
        handleUndo={() => {}}
        handleRedo={() => {}}
        setVehicles={vehiclesHook.setVehicles}
        setPaths={pathsHook.setPaths}
        setAnnotations={annotationsHook.setAnnotations}
        centerOnVehicles={() => {}}
        mapRef={{ current: null }}
        currentVehicleType={vehiclesHook.currentVehicleType}
        onChangeVehicleType={vehiclesHook.setCurrentVehicleType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pathColor={pathColor}
        setPathColor={setPathColor}
      />
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          setCenter={setMapCenter}
          setZoom={setMapZoom}
          vehicles={vehiclesHook.vehicles}
          selectedVehicleId={vehiclesHook.selectedVehicle}
          paths={pathsHook.paths}
          annotations={annotationsHook.annotations}
          onVehicleSelect={vehiclesHook.selectVehicle}
          onRemoveVehicle={vehiclesHook.removeVehicle}
          onRotateVehicle={vehiclesHook.rotateVehicle}
          onChangeVehicleType={vehiclesHook.changeVehicleType}
          onPathSelect={() => {}}
          onPathRemove={pathsHook.removePath}
          onAnnotationSelect={(id) => {
            const annotation = annotationsHook.annotations.find(a => a.id === id);
            return annotation;
          }}
          onAnnotationRemove={annotationsHook.removeAnnotation}
          onAnnotationUpdate={annotationsHook.updateAnnotation}
          activeTab={activeTab}
          readOnly={readOnly}
          onPathStart={pathsHook.startPath}
          onPathContinue={pathsHook.continuePath}
          onPathComplete={(color) => pathsHook.completePath(color)}
          currentPathPoints={pathsHook.currentPathPoints}
          isDrawing={pathsHook.isDrawing}
          pathColor={pathColor}
          isTilting={isTilting}
        />
      </div>
    </div>
  );
};

export default SchemeContainer;
