
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import VehiclesLayer from './VehiclesLayer';
import PathsLayer from './PathsLayer';
import AnnotationsLayer from './AnnotationsLayer';
import MapInitializer from './MapInitializer';
import { Vehicle, Path, Annotation } from '../types';

interface MapContainerProps {
  center: [number, number];
  zoom: number;
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  currentPathPoints: [number, number][];
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  selectedVehicle: string | null;
  onVehicleSelect: (id: string | null) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle?: (id: string, degrees: number) => void;
  onChangeVehicleType?: (type: 'car' | 'truck' | 'bike') => void;
  onRemoveAnnotation?: (id: string) => void;
  onUpdateAnnotation?: (id: string, text: string) => void;
  onMapReady: (map: L.Map) => void;
  readOnly: boolean;
}

const MapContainer = ({
  center,
  zoom,
  vehicles,
  paths,
  annotations,
  currentPathPoints,
  drawingLayerRef,
  selectedVehicle,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onChangeVehicleType,
  onRemoveAnnotation,
  onUpdateAnnotation,
  onMapReady,
  readOnly
}: MapContainerProps) => {
  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      style={{ height: '400px', width: '100%' }}
      className="z-0"
      // Explicitly disable all controls to avoid issues
      zoomControl={false}
      attributionControl={false}
      doubleClickZoom={false}
      dragging={!readOnly}
      touchZoom={!readOnly}
      scrollWheelZoom={!readOnly}
      keyboard={false}
      boxZoom={false}
      tap={false}
      preferCanvas={true}
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
        onChangeVehicleType={onChangeVehicleType}
      />
      
      <PathsLayer
        paths={paths}
        drawingLayerRef={drawingLayerRef}
        currentPathPoints={currentPathPoints}
        selectedVehicle={selectedVehicle}
        vehicles={vehicles}
      />
      
      <AnnotationsLayer 
        annotations={annotations}
        readOnly={readOnly}
        onRemoveAnnotation={onRemoveAnnotation}
        onUpdateAnnotation={onUpdateAnnotation}
      />
      
      <MapInitializer onMapReady={onMapReady} />
    </LeafletMapContainer>
  );
};

export default MapContainer;
