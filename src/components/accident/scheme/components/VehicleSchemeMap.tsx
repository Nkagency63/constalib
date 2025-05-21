
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { SchemeData } from '../../types/types';
import MapResizer from '../../MapResizer';
import 'leaflet/dist/leaflet.css';
import SchemeContainer from './SchemeContainer';

interface VehicleSchemeMapProps {
  schemeData: SchemeData;
  onVehicleMove: (id: string, x: number, y: number) => void;
  onVehicleRotate: (id: string, rotation: number) => void;
  onAddVehicle: () => void;
  onRemoveVehicle: (id: string) => void;
}

const VehicleSchemeMap: React.FC<VehicleSchemeMapProps> = ({
  schemeData,
  onVehicleMove,
  onVehicleRotate,
  onAddVehicle,
  onRemoveVehicle
}) => {
  return (
    <MapContainer
      center={schemeData.center as [number, number]}
      zoom={schemeData.zoom || 17}
      className="map-container"
      attributionControl={false}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapResizer />
      
      <SchemeContainer
        vehicles={schemeData.vehicles}
        onVehicleMove={onVehicleMove}
        onVehicleRotate={onVehicleRotate}
        onAddVehicle={onAddVehicle}
        onRemoveVehicle={onRemoveVehicle}
        width={500}
        height={500}
      />
    </MapContainer>
  );
};

export default VehicleSchemeMap;
