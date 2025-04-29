
import { Vehicle, Path, Annotation } from '../types';

interface UndoRedoProps {
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
}

export const handleUndoWrapper = ({
  canUndo,
  vehicles,
  paths,
  annotations,
  handleUndo,
  setVehicles,
  setPaths,
  setAnnotations,
  centerOnVehicles,
  mapRef
}: UndoRedoProps) => {
  if (!canUndo) return;
  
  const currentState = { 
    vehicles, 
    paths, 
    annotations, 
    center: [0, 0], 
    zoom: mapRef.current?.getZoom() || 17 
  };
  
  const prevState = handleUndo(currentState);
  setVehicles(prevState.vehicles);
  setPaths(prevState.paths);
  setAnnotations(prevState.annotations);
  
  // Auto-center on vehicles after undo
  if (prevState.vehicles.length > 0) {
    setTimeout(() => centerOnVehicles(prevState.vehicles), 100);
  }
};

export const handleRedoWrapper = ({
  canRedo,
  vehicles,
  paths,
  annotations,
  handleRedo,
  setVehicles,
  setPaths,
  setAnnotations,
  centerOnVehicles,
  mapRef
}: UndoRedoProps) => {
  if (!canRedo) return;
  
  const currentState = { 
    vehicles, 
    paths, 
    annotations, 
    center: [0, 0], 
    zoom: mapRef.current?.getZoom() || 17 
  };
  
  const nextState = handleRedo(currentState);
  setVehicles(nextState.vehicles);
  setPaths(nextState.paths);
  setAnnotations(nextState.annotations);
  
  // Auto-center on vehicles after redo
  if (nextState.vehicles.length > 0) {
    setTimeout(() => centerOnVehicles(nextState.vehicles), 100);
  }
};
