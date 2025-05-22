
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Path } from '../types';

export const usePaths = () => {
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPathPoints, setCurrentPathPoints] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | undefined>(undefined);
  const [currentPathColor, setCurrentPathColor] = useState<string | null>(null);

  const startPath = (point: [number, number], vehicleId?: string, color?: string | null) => {
    setIsDrawing(true);
    setCurrentPathPoints([point]);
    
    // Store the vehicle ID and color if provided
    if (vehicleId) setCurrentVehicleId(vehicleId);
    if (color) setCurrentPathColor(color);
  };

  const continuePath = (point: [number, number]) => {
    setCurrentPathPoints([...currentPathPoints, point]);
  };

  const completePath = (selectedVehicle: string | null, vehicleColor: string | null) => {
    if (currentPathPoints.length > 1) {
      const newPath: Path = {
        id: uuidv4(),
        points: currentPathPoints,
        color: currentPathColor || vehicleColor || 'black',
        vehicleId: currentVehicleId || selectedVehicle || undefined,
        isSelected: false
      };

      const updatedPaths = [...paths, newPath];
      setPaths(updatedPaths);
      resetPath();
      return updatedPaths;
    }
    return paths;
  };

  const resetPath = () => {
    setIsDrawing(false);
    setCurrentPathPoints([]);
    setCurrentVehicleId(undefined);
    setCurrentPathColor(null);
  };

  return {
    paths,
    setPaths,
    currentPathPoints,
    isDrawing,
    startPath,
    continuePath,
    completePath,
    resetPath
  };
};
