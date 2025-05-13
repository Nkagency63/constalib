import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Path } from '../types';

export const usePaths = () => {
  const [paths, setPaths] = useState<Path[]>([]);

  const addPath = useCallback((points: [number, number][], color: string, vehicleId?: string) => {
    const newPath: Path = {
      id: uuidv4(),
      points,
      color,
      width: 3,
      dashed: false,
      vehicleId,
      isSelected: true,
    };

    setPaths(prevPaths => [...prevPaths, newPath]);
  }, [paths]);

  const updatePath = useCallback((id: string, updates: Partial<Path>) => {
    setPaths(prevPaths =>
      prevPaths.map(path => (path.id === id ? { ...path, ...updates } : path))
    );
  }, []);

  const removePath = useCallback((id: string) => {
    setPaths(prevPaths => prevPaths.filter(path => path.id !== id));
  }, []);

  return {
    paths,
    addPath,
    updatePath,
    removePath,
  };
};
