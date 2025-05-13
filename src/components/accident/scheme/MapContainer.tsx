
import React, { useRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle, Path, Annotation } from '../types/scheme';
import VehiclesLayer from './VehiclesLayer';
import PathsLayer from './PathsLayer';
import AnnotationsLayer from './AnnotationsLayer';
import MapInitializer from './MapInitializer';

interface MapContainerProps {
  center: [number, number];
  zoom: number;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  paths: Path[];
  annotations: Annotation[];
  onVehicleSelect: (id: string) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle: (id: string, degrees: number) => void;
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
  onPathSelect: (id: string) => void;
  onPathRemove: (id: string) => void;
  onAnnotationSelect: (id: string) => void;
  onAnnotationRemove: (id: string) => void;
  onAnnotationUpdate: (id: string, text: string) => void;
  activeTab: 'vehicles' | 'paths' | 'annotations';
  readOnly?: boolean;
  onPathStart: (point: [number, number]) => void;
  onPathContinue: (point: [number, number]) => void;
  onPathComplete: (color: string) => void;
  currentPathPoints: [number, number][];
  isDrawing: boolean;
  pathColor: string;
  isTilting: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({
  center,
  zoom,
  setCenter,
  setZoom,
  vehicles,
  selectedVehicle,
  paths,
  annotations,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onChangeVehicleType,
  onPathSelect,
  onPathRemove,
  onAnnotationSelect,
  onAnnotationRemove,
  onAnnotationUpdate,
  activeTab,
  readOnly = false,
  onPathStart,
  onPathContinue,
  onPathComplete,
  currentPathPoints,
  isDrawing,
  pathColor,
  isTilting,
}) => {
  const mapRef = useRef(null);

  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapInitializer
        setCenter={setCenter}
        setZoom={setZoom}
        onMapClick={(latlng) => {
          if (activeTab === 'vehicles' && !readOnly) {
            // Add vehicle at clicked location
          } else if (activeTab === 'paths' && !readOnly) {
            if (!isDrawing) {
              onPathStart([latlng.lat, latlng.lng]);
            } else {
              onPathContinue([latlng.lat, latlng.lng]);
            }
          } else if (activeTab === 'annotations' && !readOnly) {
            // Add annotation at clicked location
          }
        }}
        onMapDoubleClick={() => {
          if (activeTab === 'paths' && isDrawing && !readOnly) {
            onPathComplete(pathColor);
          }
        }}
        onMapMove={(latlng) => {
          if (activeTab === 'paths' && isDrawing && !readOnly) {
            onPathContinue([latlng.lat, latlng.lng]);
          }
        }}
      />

      <VehiclesLayer
        vehicles={vehicles}
        selectedVehicleId={selectedVehicle}
        readOnly={readOnly}
        onVehicleSelect={onVehicleSelect}
        onRemoveVehicle={onRemoveVehicle}
        onRotateVehicle={onRotateVehicle}
        onChangeVehicleType={onChangeVehicleType}
      />

      <PathsLayer
        paths={paths}
        currentPathPoints={currentPathPoints}
        isDrawing={isDrawing}
        pathColor={pathColor}
        readOnly={readOnly}
      />

      <AnnotationsLayer
        annotations={annotations}
        onSelect={onAnnotationSelect}
        onRemove={onAnnotationRemove}
        onUpdate={onAnnotationUpdate}
        readOnly={readOnly}
      />
    </LeafletMapContainer>
  );
};

export default MapContainer;
