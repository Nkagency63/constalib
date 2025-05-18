import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { TooltipProvider } from '@/components/ui/tooltip';
import SchemeInfo from '../SchemeInfo';
import SchemeGuide from '../SchemeGuide';
import StepByStepGuide from '../StepByStepGuide';
import KeyboardShortcuts from '../KeyboardShortcuts';
import { Vehicle, Path, Annotation, GeolocationData } from '../../types';
import VehiclesLayer from '../VehiclesLayer';
import PathsLayer from '../PathsLayer';
import AnnotationsLayer from '../AnnotationsLayer';
import MapInitializer from '../../MapInitializer';
import 'leaflet/dist/leaflet.css';

interface SchemeMapWrapperProps {
  center: [number, number];
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  currentPathPoints: [number, number][];
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  selectedVehicle: string | null;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  isEmpty: boolean;
  readOnly: boolean;
  onVehicleSelect: (id: string | null) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle: (id: string, degrees: number) => void;
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
  onRemoveAnnotation: (id: string) => void;
  onUpdateAnnotation: (id: string, text: string) => void;
  onMapReady: (map: L.Map) => void;
  geolocationData?: GeolocationData;
}

const SchemeMapWrapper: React.FC<SchemeMapWrapperProps> = ({
  center,
  vehicles,
  paths,
  annotations,
  currentPathPoints,
  drawingLayerRef,
  selectedVehicle,
  currentTool,
  isEmpty,
  readOnly,
  onVehicleSelect,
  onRemoveVehicle,
  onRotateVehicle,
  onChangeVehicleType,
  onRemoveAnnotation,
  onUpdateAnnotation,
  onMapReady,
  geolocationData
}) => {
  console.log('SchemeMapWrapper rendering with center:', center);
  
  // Generate map key based on center coordinates to force re-render when center changes
  const mapKey = `map-${center[0].toFixed(6)}-${center[1].toFixed(6)}`;
  
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 h-full">
      <TooltipProvider>
        <div className="h-full w-full">
          <MapContainer
            key={mapKey}
            center={center}
            zoom={17}
            style={{ 
              height: "100%", 
              width: "100%", 
              minHeight: "350px",
              position: "relative",
              zIndex: 1 
            }}
            attributionControl={false}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
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
                  Précision: ~{geolocationData.accuracy < 1000 ? 
                    `${Math.round(geolocationData.accuracy)} m` : 
                    `${(geolocationData.accuracy/1000).toFixed(1)} km`}
                </Popup>
              </Circle>
            )}
            
            <MapInitializer onMapReady={onMapReady} />
            
            <VehiclesLayer
              vehicles={vehicles}
              selectedVehicleId={selectedVehicle}
              onVehicleSelect={onVehicleSelect}
              onRemoveVehicle={onRemoveVehicle}
              onRotateVehicle={onRotateVehicle}
              readOnly={readOnly}
            />
            
            <PathsLayer
              paths={paths}
              currentPathPoints={currentPathPoints}
              isDrawing={currentPathPoints.length > 0}
              pathColor="#ff0000"
              readOnly={readOnly}
              drawingLayerRef={drawingLayerRef}
              selectedVehicle={selectedVehicle}
              vehicles={vehicles}
            />
            
            <AnnotationsLayer
              annotations={annotations}
              readOnly={readOnly}
              onRemove={onRemoveAnnotation}
              onUpdate={onUpdateAnnotation}
            />
          </MapContainer>
        </div>

        {/* Guidance components */}
        {!readOnly && (
          <>
            <SchemeGuide 
              currentTool={currentTool}
              isEmpty={isEmpty}
            />
            
            <StepByStepGuide 
              vehicleCount={vehicles.length}
              pathCount={paths.length}
              annotationCount={annotations.length}
            />
            
            <KeyboardShortcuts 
              selectedVehicle={selectedVehicle}
            />
          </>
        )}

        <SchemeInfo 
          vehicleCount={vehicles.length}
          pathCount={paths.length}
          annotationCount={annotations.length}
          isEmpty={isEmpty}
          geolocationAddress={geolocationData?.address}
        />
      </TooltipProvider>
    </div>
  );
};

export default SchemeMapWrapper;
