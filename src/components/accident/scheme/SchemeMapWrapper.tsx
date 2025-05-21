
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { TooltipProvider } from '@/components/ui/tooltip';
import 'leaflet/dist/leaflet.css';
import { Vehicle, Path, Annotation, GeolocationData } from '../types';
import VehiclesLayer from './VehiclesLayer';
import PathsLayer from './PathsLayer';
import AnnotationsLayer from './AnnotationsLayer';
import MapResizer from '../MapResizer';
import MapInitializer from '../MapInitializer';
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
  geolocationData?: GeolocationData;
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
  children,
  geolocationData
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
      
      {/* Add MapResizer for size invalidation */}
      <MapResizer />
      
      {onMapReady && (
        <MapInitializer onMapReady={onMapReady} />
      )}
      
      {/* Show geolocation accuracy circle if available */}
      {geolocationData?.accuracy && geolocationData.accuracy > 0 && (
        <Circle 
          center={[geolocationData.lat, geolocationData.lng]}
          radius={geolocationData.accuracy}
          pathOptions={{ 
            fillColor: '#3388ff', 
            fillOpacity: 0.1, 
            weight: 1,
            color: '#3388ff',
            opacity: 0.3
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">Position détectée</p>
              {geolocationData.address && (
                <p className="mt-1">{geolocationData.address}</p>
              )}
              <p className="mt-1 text-xs text-gray-600">
                Précision: ~{geolocationData.accuracy < 1000 ? 
                  `${Math.round(geolocationData.accuracy)} m` : 
                  `${(geolocationData.accuracy/1000).toFixed(1)} km`}
              </p>
            </div>
          </Popup>
        </Circle>
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
