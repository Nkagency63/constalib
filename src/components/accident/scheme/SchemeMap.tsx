
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import VehiclesLayer from './VehiclesLayer';
import PathsLayer from './PathsLayer';
import MapInitializer from './MapInitializer';
import { useSchemeContext } from '../context/SchemeContext';
import 'leaflet/dist/leaflet.css';

interface SchemeMapProps {
  onMapReady: (map: L.Map) => void;
}

const SchemeMap = ({ onMapReady }: SchemeMapProps) => {
  const { center, vehicles, selectedVehicle, paths, currentPathPoints, drawingLayerRef } = useSchemeContext();

  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{ height: '400px', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <VehiclesLayer
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
      />
      
      <PathsLayer
        paths={paths}
        drawingLayerRef={drawingLayerRef}
        currentPathPoints={currentPathPoints}
        selectedVehicle={selectedVehicle}
        vehicles={vehicles}
      />
      
      <MapInitializer onMapReady={onMapReady} />
    </MapContainer>
  );
};

export default SchemeMap;
