
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Path } from '../types';

export const usePaths = () => {
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPathPoints, setCurrentPathPoints] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const startPath = (point: [number, number]) => {
    setIsDrawing(true);
    setCurrentPathPoints([point]);
  };

  const continuePath = (point: [number, number]) => {
    setCurrentPathPoints([...currentPathPoints, point]);
  };

  const completePath = (selectedVehicle: string | null, vehicleColor: string | null) => {
    if (currentPathPoints.length > 1) {
      const newPath: Path = {
        id: uuidv4(),
        points: currentPathPoints,
        color: selectedVehicle ? vehicleColor || 'black' : 'black',
        vehicleId: selectedVehicle || undefined,
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
