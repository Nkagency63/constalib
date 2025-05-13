
import React, { useState, useEffect } from 'react';
import { SchemeData } from '../types/scheme';
import MapContainer from './MapContainer';
import SchemeToolbars from './components/SchemeToolbars';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';

interface SchemeContainerProps {
  initialData?: SchemeData;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
}

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  initialData,
  onSchemeUpdate,
  readOnly = false,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'paths' | 'annotations'>('vehicles');
  const [pathColor, setPathColor] = useState<string>('#ff0000');
  const [isTilting, setIsTilting] = useState<boolean>(false);

  const vehicles = useVehicles();
  const paths = usePaths();
  const annotations = useAnnotations();
  
  // Initialize with initial data if provided
  useEffect(() => {
    if (initialData) {
      if (initialData.vehicles) {
        vehicles.setVehicles(initialData.vehicles);
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
    if (onSchemeUpdate) {
      const currentData: SchemeData = {
        vehicles: vehicles.vehicles,
        paths: paths.paths,
        annotations: annotations.annotations,
        center: mapCenter,
        zoom: mapZoom,
      };
      onSchemeUpdate(currentData);
    }
  }, [vehicles.vehicles, paths.paths, annotations.annotations, mapCenter, mapZoom, onSchemeUpdate]);

  return (
    <div className="scheme-container h-full flex flex-col">
      <SchemeToolbars
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vehicles={vehicles}
        paths={paths}
        annotations={annotations}
        pathColor={pathColor}
        setPathColor={setPathColor}
        readOnly={readOnly}
      />
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          setCenter={setMapCenter}
          setZoom={setMapZoom}
          vehicles={vehicles.vehicles}
          selectedVehicle={vehicles.selectedVehicle}
          paths={paths.paths}
          annotations={annotations.annotations}
          onVehicleSelect={vehicles.selectVehicle}
          onRemoveVehicle={vehicles.removeVehicle}
          onRotateVehicle={vehicles.rotateVehicle}
          onChangeVehicleType={vehicles.changeVehicleType}
          onPathSelect={() => {}}
          onPathRemove={paths.removePath}
          onAnnotationSelect={annotations.selectAnnotation}
          onAnnotationRemove={annotations.removeAnnotation}
          onAnnotationUpdate={annotations.updateAnnotation}
          activeTab={activeTab}
          readOnly={readOnly}
          onPathStart={paths.startPath}
          onPathContinue={paths.continuePath}
          onPathComplete={(color) => paths.completePath(color)}
          currentPathPoints={paths.currentPathPoints}
          isDrawing={paths.isDrawing}
          pathColor={pathColor}
          isTilting={isTilting}
        />
      </div>
    </div>
  );
};

export default SchemeContainer;
