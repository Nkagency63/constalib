
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Path } from '../types';

export const usePaths = () => {
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPathPoints, setCurrentPathPoints] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const addPath = useCallback((points: [number, number][], color: string, vehicleId?: string) => {
    const newPath: Path = {
      id: uuidv4(),
      points,
      color,
      width: 3,
      dashed: false,
      vehicleId: vehicleId || '',
      isSelected: true, // Make sure isSelected is included when adding a new path
    };

    setPaths(prevPaths => [...prevPaths, newPath]);
    return newPath;
  }, []);

  const updatePath = useCallback((id: string, updates: Partial<Path>) => {
    setPaths(prevPaths =>
      prevPaths.map(path => (path.id === id ? { ...path, ...updates } : path))
    );
  }, []);

  const removePath = useCallback((id: string) => {
    setPaths(prevPaths => prevPaths.filter(path => path.id !== id));
  }, []);

  const startPath = useCallback((point: [number, number]) => {
    setCurrentPathPoints([point]);
    setIsDrawing(true);
  }, []);

  const continuePath = useCallback((point: [number, number]) => {
    if (isDrawing) {
      setCurrentPathPoints(prev => [...prev, point]);
    }
  }, [isDrawing]);

  const completePath = useCallback((color: string, vehicleId?: string) => {
    if (currentPathPoints.length > 1) {
      addPath(currentPathPoints, color, vehicleId);
    }
    setCurrentPathPoints([]);
    setIsDrawing(false);
  }, [currentPathPoints, addPath]);

  return {
    paths,
    addPath,
    updatePath,
    removePath,
    setPaths,
    currentPathPoints,
    isDrawing,
    startPath,
    continuePath,
    completePath
  };
};
