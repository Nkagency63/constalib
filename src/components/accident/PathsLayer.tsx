
import React from 'react';
import { Polyline, LayerGroup } from 'react-leaflet';
import { Path } from './types';

interface PathsLayerProps {
  paths: Path[];
  currentPathPoints?: [number, number][];
  isDrawing?: boolean;
  pathColor?: string;
  readOnly?: boolean;
  drawingLayerRef?: React.MutableRefObject<L.LayerGroup | null>;
  selectedVehicle?: string | null;
  vehicles?: any[];
}

const PathsLayer = ({
  paths,
  currentPathPoints = [],
  isDrawing = false,
  pathColor = '#ff0000',
  readOnly = false,
  drawingLayerRef,
  selectedVehicle,
  vehicles = []
}: PathsLayerProps) => {
  // Get color of selected vehicle if available
  const selectedVehicleColor = React.useMemo(() => {
    if (!selectedVehicle || !vehicles.length) return pathColor;
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    return vehicle?.color || pathColor;
  }, [selectedVehicle, vehicles, pathColor]);
  
  return (
    <>
      {/* Completed paths */}
      {paths.map((path) => (
        <Polyline
          key={path.id}
          positions={path.points}
          pathOptions={{
            color: path.color,
            weight: path.width || 4,
            opacity: path.isSelected ? 1.0 : 0.7,
            dashArray: path.dashed ? '10, 10' : undefined,
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
      {drawingLayerRef && <LayerGroup ref={drawingLayerRef} />}
    </>
  );
};

export default PathsLayer;
