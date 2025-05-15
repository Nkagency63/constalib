
import React from 'react';
import { Polyline, LayerGroup } from 'react-leaflet';
import { Path, Vehicle } from '../types';

interface PathsLayerProps {
  paths: Path[];
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  currentPathPoints: [number, number][];
  selectedVehicle: string | null;
  vehicles: Vehicle[];
}

const PathsLayer = ({
  paths,
  drawingLayerRef,
  currentPathPoints,
  selectedVehicle,
  vehicles
}: PathsLayerProps) => {
  // Get color of selected vehicle
  const selectedVehicleColor = React.useMemo(() => {
    if (!selectedVehicle) return '#3b82f6'; // Default blue
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    return vehicle?.color || '#3b82f6';
  }, [selectedVehicle, vehicles]);
  
  return (
    <>
      {/* Completed paths */}
      {paths.map((path) => (
        <Polyline
          key={path.id}
          positions={path.points}
          pathOptions={{
            color: path.color,
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
          }}
        />
      ))}
      
      {/* Currently drawing path */}
      {currentPathPoints.length > 0 && (
        <Polyline
          positions={currentPathPoints}
          pathOptions={{
            color: selectedVehicleColor,
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 10',
          }}
        />
      )}
      
      {/* Layer group for dynamic drawing */}
      <LayerGroup ref={drawingLayerRef} />
    </>
  );
};

export default PathsLayer;
