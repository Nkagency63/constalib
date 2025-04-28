
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import VehiclesLayer from './VehiclesLayer';
import PathsLayer from './PathsLayer';
import MapInitializer from './MapInitializer';
import { Vehicle, Path } from '../types';

interface MapContainerProps {
  center: [number, number];
  zoom: number;
  vehicles: Vehicle[];
  paths: Path[];
  currentPathPoints: [number, number][];
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  selectedVehicle: string | null;
  onVehicleSelect: (id: string | null) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle?: (id: string, degrees: number) => void;
  onMapReady: (map: L.Map) => void;
  readOnly: boolean;
}

const MapContainer = ({
  center,
  zoom,
  vehicles,
  paths,
  currentPathPoints,
  drawingLayerRef,
  selectedVehicle,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onMapReady,
  readOnly
}: MapContainerProps) => {
  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      style={{ height: '400px', width: '100%' }}
      className="z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <VehiclesLayer
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        readOnly={readOnly}
        onVehicleSelect={onVehicleSelect}
        onRemoveVehicle={onRemoveVehicle}
        onRotateVehicle={onRotateVehicle}
      />
      
      <PathsLayer
        paths={paths}
        drawingLayerRef={drawingLayerRef}
        currentPathPoints={currentPathPoints}
        selectedVehicle={selectedVehicle}
        vehicles={vehicles}
      />
      
      <MapInitializer onMapReady={onMapReady} />
    </LeafletMapContainer>
  );
};

export default MapContainer;
