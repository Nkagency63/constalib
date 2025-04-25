
import React from 'react';
import { Path } from '../types';
import L from 'leaflet';

interface PathsLayerProps {
  paths: Path[];
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  currentPathPoints: [number, number][];
  selectedVehicle: string | null;
  vehicles: { id: string; color: string; }[];
}

const PathsLayer = ({
  paths,
  drawingLayerRef,
  currentPathPoints,
  selectedVehicle,
  vehicles
}: PathsLayerProps) => {
  React.useEffect(() => {
    if (drawingLayerRef.current && currentPathPoints.length > 1) {
      const lastTwoPoints = currentPathPoints.slice(-2);
      const selectedVehicleColor = selectedVehicle 
        ? vehicles.find(v => v.id === selectedVehicle)?.color 
        : 'black';
      
      L.polyline(lastTwoPoints, {
        color: selectedVehicleColor || 'black',
        weight: 3,
        opacity: 0.7
      }).addTo(drawingLayerRef.current);
    }
  }, [currentPathPoints, selectedVehicle, vehicles]);

  return null;
};

export default PathsLayer;
