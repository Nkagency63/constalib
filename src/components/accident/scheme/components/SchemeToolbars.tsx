
import React from 'react';
import CanvasToolbar from '../CanvasToolbar';
import SchemeToolbar from '../SchemeToolbar';
import { handleUndoWrapper, handleRedoWrapper } from '../SchemeUndoRedo';
import { handleExportImage } from '../SchemeExport';
import { Vehicle, Path, Annotation } from '../../types';

interface SchemeToolbarsProps {
  readOnly: boolean;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  setCurrentTool: (tool: 'select' | 'vehicle' | 'path' | 'annotation') => void;
  onAddVehicle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  handleUndo: (currentState: any) => any;
  handleRedo: (currentState: any) => any;
  setVehicles: (vehicles: Vehicle[]) => void;
  setPaths: (paths: Path[]) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  centerOnVehicles: (vehicles: Vehicle[]) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
  currentVehicleType: 'car' | 'truck' | 'bike';
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
  // Optional props for component mapping to different implementations
  activeTab?: 'vehicles' | 'paths' | 'annotations';
  setActiveTab?: (tab: 'vehicles' | 'paths' | 'annotations') => void;
  pathColor?: string;
  setPathColor?: (color: string) => void;
}

const SchemeToolbars: React.FC<SchemeToolbarsProps> = ({
  readOnly,
  currentTool,
  setCurrentTool,
  onAddVehicle,
  canUndo,
  canRedo,
  vehicles,
  paths,
  annotations,
  handleUndo,
  handleRedo,
  setVehicles,
  setPaths,
  setAnnotations,
  centerOnVehicles,
  mapRef,
  currentVehicleType,
  onChangeVehicleType,
  activeTab,
  setActiveTab,
  pathColor,
  setPathColor
}) => {
  if (readOnly) return null;
  
  return (
    <>
      <CanvasToolbar 
        onAddVehicle={onAddVehicle}
        onUndo={() => handleUndoWrapper({
          canUndo,
          canRedo,
          vehicles,
          paths,
          annotations,
          handleUndo,
          handleRedo,
          setVehicles,
          setPaths,
          setAnnotations,
          centerOnVehicles,
          mapRef
        })}
        onRedo={() => handleRedoWrapper({
          canUndo,
          canRedo,
          vehicles,
          paths,
          annotations,
          handleUndo,
          handleRedo,
          setVehicles,
          setPaths,
          setAnnotations,
          centerOnVehicles,
          mapRef
        })}
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        canUndo={canUndo}
        canRedo={canRedo}
        onExportImage={() => handleExportImage({ mapRef })}
        onCenterVehicles={() => centerOnVehicles(vehicles)}
        currentVehicleType={currentVehicleType}
        onChangeVehicleType={onChangeVehicleType}
      />
      
      <SchemeToolbar 
        currentTool={currentTool}
        onSelect={() => setCurrentTool('select')}
        onAddVehicle={() => setCurrentTool('vehicle')}
        onAddPath={() => setCurrentTool('path')}
        onAddAnnotation={() => setCurrentTool('annotation')}
      />
    </>
  );
};

export default SchemeToolbars;
