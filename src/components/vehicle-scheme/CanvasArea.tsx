
import React, { useRef } from 'react';
import VehicleItem from './VehicleItem';
import { Vehicle } from './types';

interface CanvasAreaProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  zoom: number;
  isDragging: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (vehicleId: string, e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  rotateVehicle: (vehicleId: string, angle: number) => void;
  removeVehicle: (vehicleId: string) => void;
}

const CanvasArea = ({
  vehicles,
  selectedVehicle,
  zoom,
  isDragging,
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  rotateVehicle,
  removeVehicle
}: CanvasAreaProps) => {
  return (
    <div className="relative w-full h-[400px] border border-constalib-gray rounded-lg overflow-hidden bg-white mb-4">
      <div 
        ref={canvasRef}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U2ZTZlNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {vehicles.map(vehicle => (
          <VehicleItem
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicle === vehicle.id}
            onMouseDown={handleMouseDown}
            onRotate={rotateVehicle}
            onRemove={removeVehicle}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasArea;
