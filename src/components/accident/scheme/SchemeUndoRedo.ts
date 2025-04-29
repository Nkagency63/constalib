
import { Vehicle, Path, Annotation, SchemeData } from '../types';
import { MutableRefObject } from 'react';

export interface UndoRedoProps {
  canUndo: boolean;
  canRedo: boolean;
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  handleUndo: (currentState: SchemeData) => SchemeData;
  handleRedo: (currentState: SchemeData) => SchemeData;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  setPaths: React.Dispatch<React.SetStateAction<Path[]>>;
  setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
  centerOnVehicles: (vehicles: Vehicle[]) => void;
  mapRef: MutableRefObject<L.Map | null>;
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
  if (!canUndo || !mapRef.current) return;

  const currentState: SchemeData = {
    vehicles,
    paths,
    annotations,
    center: [
      mapRef.current.getCenter().lat,
      mapRef.current.getCenter().lng
    ],
    zoom: mapRef.current.getZoom()
  };

  const prevState = handleUndo(currentState);
  
  setVehicles(prevState.vehicles);
  setPaths(prevState.paths);
  setAnnotations(prevState.annotations);
  
  if (prevState.vehicles.length > 0) {
    centerOnVehicles(prevState.vehicles);
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
  if (!canRedo || !mapRef.current) return;

  const currentState: SchemeData = {
    vehicles,
    paths,
    annotations,
    center: [
      mapRef.current.getCenter().lat,
      mapRef.current.getCenter().lng
    ],
    zoom: mapRef.current.getZoom()
  };

  const nextState = handleRedo(currentState);
  
  setVehicles(nextState.vehicles);
  setPaths(nextState.paths);
  setAnnotations(nextState.annotations);
  
  if (nextState.vehicles.length > 0) {
    centerOnVehicles(nextState.vehicles);
  }
};
