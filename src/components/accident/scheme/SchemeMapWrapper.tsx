
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './scheme.css';
import MapComponent from '../MapComponent';
import MapInitializer from '../MapInitializer';
import { Vehicle } from '../types';
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
  // Create a stable key for the current center
  const mapKey = useMemo(() => {
    // Ensure center is valid
    if (!center || !Array.isArray(center) || center.length !== 2) {
      console.warn("Invalid center provided to SchemeMapWrapper:", center);
      return `map-invalid-${uuidv4().substring(0, 8)}`;
    }
    return `map-${center[0].toFixed(6)}-${center[1].toFixed(6)}-${zoom}-${uuidv4().substring(0, 8)}`;
  }, [center, zoom]);
  
  // Debug log
  React.useEffect(() => {
    console.log("SchemeMapWrapper rendered with center:", center, "and key:", mapKey);
  }, [center, mapKey]);

  // Default center if provided center is invalid
  const validCenter: [number, number] = (center && Array.isArray(center) && center.length === 2) 
    ? center 
    : [48.8566, 2.3522];

  return (
    <MapContainer
      key={mapKey}
      center={validCenter}
      zoom={zoom || 13}
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
      zoomControl={false}
      className="leaflet-container z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Add MapComponent for size invalidation */}
      <MapComponent />
      
      {onMapReady && (
        <MapInitializer onMapReady={onMapReady} />
      )}
      
      <VehiclesLayer
        vehicles={vehicles || []}
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
