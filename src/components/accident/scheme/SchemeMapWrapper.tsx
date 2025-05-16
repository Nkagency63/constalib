
import React, { useState, useEffect } from 'react';
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
  // Use a unique key for the map to force recreation when center changes dramatically
  const [mapKey, setMapKey] = useState(uuidv4());
  const [prevCenter, setPrevCenter] = useState(center);
  
  // Force map recreation if center changes dramatically to prevent weird behavior
  useEffect(() => {
    const [prevLat, prevLng] = prevCenter;
    const [newLat, newLng] = center;
    
    // Calculate distance between previous and new center
    const distance = Math.sqrt(
      Math.pow(newLat - prevLat, 2) + Math.pow(newLng - prevLng, 2)
    );
    
    // If distance is significant, recreate the map
    if (distance > 1) { // 1 degree is approximately 111km
      setMapKey(uuidv4());
      setPrevCenter(center);
    }
  }, [center, prevCenter]);

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
      
      <MapInitializer onMapReady={onMapReady} />
      
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
