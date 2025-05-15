
import { Vehicle, Path, Annotation } from '../types';

interface HandleUndoRedoProps {
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

// Fonction pour gérer l'annulation
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
}: HandleUndoRedoProps) => {
  if (!canUndo) return;
  
  try {
    const prevState = handleUndo({
      vehicles,
      paths,
      annotations,
      center: mapRef.current ? [
        mapRef.current.getCenter().lat,
        mapRef.current.getCenter().lng
      ] : [0, 0],
      zoom: mapRef.current ? mapRef.current.getZoom() : 17
    });
    
    if (prevState) {
      setVehicles(prevState.vehicles || []);
      setPaths(prevState.paths || []);
      setAnnotations(prevState.annotations || []);
      
      // Si des coordonnées de centre sont présentes, recentrer la carte
      if (prevState.center && mapRef.current) {
        mapRef.current.setView(prevState.center, prevState.zoom || mapRef.current.getZoom());
      }
      
      // Si des véhicules sont présents, centrer sur eux
      if (prevState.vehicles && prevState.vehicles.length > 0) {
        setTimeout(() => centerOnVehicles(prevState.vehicles), 100);
      }
    }
  } catch (error) {
    console.error("Error during undo operation:", error);
  }
};

// Fonction pour gérer le rétablissement
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
}: HandleUndoRedoProps) => {
  if (!canRedo) return;
  
  try {
    const nextState = handleRedo({
      vehicles,
      paths,
      annotations,
      center: mapRef.current ? [
        mapRef.current.getCenter().lat,
        mapRef.current.getCenter().lng
      ] : [0, 0],
      zoom: mapRef.current ? mapRef.current.getZoom() : 17
    });
    
    if (nextState) {
      setVehicles(nextState.vehicles || []);
      setPaths(nextState.paths || []);
      setAnnotations(nextState.annotations || []);
      
      // Si des coordonnées de centre sont présentes, recentrer la carte
      if (nextState.center && mapRef.current) {
        mapRef.current.setView(nextState.center, nextState.zoom || mapRef.current.getZoom());
      }
      
      // Si des véhicules sont présents, centrer sur eux
      if (nextState.vehicles && nextState.vehicles.length > 0) {
        setTimeout(() => centerOnVehicles(nextState.vehicles), 100);
      }
    }
  } catch (error) {
    console.error("Error during redo operation:", error);
  }
};
