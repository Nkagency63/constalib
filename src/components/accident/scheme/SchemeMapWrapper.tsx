
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapInitializer from '../MapInitializer';
import { Vehicle, Path, Annotation } from '../types';
import VehiclesLayer from './VehiclesLayer';
import { v4 as uuidv4 } from 'uuid';

interface SchemeMapWrapperProps {
  center: [number, number];
  zoom: number;
  readOnly?: boolean;
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string) => void;
  onVehicleMove?: (id: string, position: [number, number]) => void;
  onMapReady?: (map: L.Map) => void;
  children?: React.ReactNode;
}

const SchemeMapWrapper: React.FC<SchemeMapWrapperProps> = ({
  center,
  zoom,
  readOnly = false,
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  onVehicleMove,
  onMapReady,
  children
}) => {
  // Créer une clé stable pour le centre actuel
  const mapKey = useMemo(() => {
    return `map-${center[0].toFixed(6)}-${center[1].toFixed(6)}-${zoom}-${uuidv4().substring(0, 8)}`;
  }, [center[0], center[1], zoom]);
  
  // Log pour debug
  useEffect(() => {
    console.log("SchemeMapWrapper rendered with center:", center, "and key:", mapKey);
  }, [center, mapKey]);

  return (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
      zoomControl={false}
      className="leaflet-container z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapInitializer 
        onMapReady={onMapReady}
      />
      
      <VehiclesLayer
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onVehicleSelect={onVehicleSelect}
        readOnly={readOnly}
        onVehicleMove={onVehicleMove}
      />
      
      {children}
    </MapContainer>
  );
};

export default SchemeMapWrapper;
