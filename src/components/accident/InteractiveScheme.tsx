import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { v4 as uuidv4 } from 'uuid';
import L from 'leaflet';
import CanvasToolbar from './scheme/CanvasToolbar';
import MapInitializer from './scheme/MapInitializer';
import SchemeToolbar from './scheme/SchemeToolbar';
import VehiclesLayer from './scheme/VehiclesLayer';
import PathsLayer from './scheme/PathsLayer';
import { useVehicles } from './hooks/useVehicles';
import { usePaths } from './hooks/usePaths';
import { useSchemeMap } from './hooks/useSchemeMap';
import { useSchemeHistory } from './hooks/useSchemeHistory';
import type { SchemeData, Annotation } from './types';

interface InteractiveSchemeProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
  readOnly?: boolean;
}

const InteractiveScheme = ({ formData, onUpdateSchemeData, readOnly = false }: InteractiveSchemeProps) => {
  const { 
    vehicles, selectedVehicle, addVehicle, removeVehicle, 
    selectVehicle, setVehicles, VEHICLE_COLORS 
  } = useVehicles();
  
  const {
    paths, setPaths, currentPathPoints, isDrawing,
    startPath, continuePath, completePath, resetPath
  } = usePaths();
  
  const { saveToHistory, handleUndo, handleRedo, canUndo, canRedo } = useSchemeHistory();
  
  const [currentTool, setCurrentTool] = React.useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [annotations, setAnnotations] = React.useState<Annotation[]>([]);

  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        if (vehicles.length < Object.keys(VEHICLE_COLORS).length) {
          const updatedVehicles = addVehicle(e.latlng);
          if (updatedVehicles) {
            if (mapRef.current) {
              mapRef.current.setView(e.latlng, mapRef.current.getZoom());
            }
            saveToHistory({ vehicles: updatedVehicles, paths, annotations, center, zoom: 17 });
          }
        }
        break;
      case 'path':
        if (isDrawing) {
          continuePath(newPoint);
        } else {
          startPath(newPoint);
        }
        break;
      case 'annotation':
        addAnnotation(newPoint);
        break;
      case 'select':
      default:
        selectVehicle(null);
        break;
    }
  };

  const { mapRef, drawingLayerRef, handleMapReady } = useSchemeMap(
    readOnly,
    handleMapClick,
    () => {
      if (formData?.geolocation?.lat && formData?.geolocation?.lng && vehicles.length === 0) {
        const initialVehicles = [];
        
        if (formData.vehicleBrand && formData.vehicleModel) {
          initialVehicles.push({
            id: uuidv4(),
            position: [
              formData.geolocation.lat + 0.0002, 
              formData.geolocation.lng - 0.0002
            ],
            color: VEHICLE_COLORS['A'],
            brand: formData.vehicleBrand,
            model: formData.vehicleModel,
            vehicleId: 'A',
            rotation: 0,
            isSelected: false
          });
        }
        
        if (formData.otherVehicle?.brand && formData.otherVehicle?.model) {
          initialVehicles.push({
            id: uuidv4(),
            position: [
              formData.geolocation.lat - 0.0002, 
              formData.geolocation.lng + 0.0002
            ],
            color: VEHICLE_COLORS['B'],
            brand: formData.otherVehicle.brand,
            model: formData.otherVehicle.model,
            vehicleId: 'B',
            rotation: 0,
            isSelected: false
          });
        }
        
        if (initialVehicles.length > 0) {
          setVehicles(initialVehicles);
          if (mapRef.current) {
            const firstVehiclePosition = L.latLng(
              initialVehicles[0].position[0],
              initialVehicles[0].position[1]
            );
            mapRef.current.setView(firstVehiclePosition, 17);
          }
          saveToHistory({
            vehicles: initialVehicles,
            paths: [],
            annotations: [],
            center,
            zoom: 17
          });
        }
      }
    }
  );

  const addAnnotation = (position: [number, number]) => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      position,
      text: 'Note',
      type: 'note'
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    
    saveToHistory({
      vehicles,
      paths,
      annotations: updatedAnnotations,
      center,
      zoom: 17
    });
  };

  React.useEffect(() => {
    if (onUpdateSchemeData && mapRef.current) {
      const schemeData: SchemeData = {
        vehicles,
        paths,
        annotations,
        center: mapRef.current ? [
          mapRef.current.getCenter().lat,
          mapRef.current.getCenter().lng
        ] as [number, number] : center,
        zoom: mapRef.current ? mapRef.current.getZoom() : 17
      };
      onUpdateSchemeData(schemeData);
    }
  }, [vehicles, paths, annotations, onUpdateSchemeData]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
      {!readOnly && (
        <CanvasToolbar 
          onAddVehicle={() => {
            if (mapRef.current && vehicles.length < Object.keys(VEHICLE_COLORS).length) {
              const center = mapRef.current.getCenter();
              const updatedVehicles = addVehicle(center);
              if (updatedVehicles) {
                saveToHistory({ 
                  vehicles: updatedVehicles, 
                  paths, 
                  annotations, 
                  center: [center.lat, center.lng], 
                  zoom: 17 
                });
              }
            }
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      )}

      {!readOnly && (
        <SchemeToolbar 
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
        />
      )}

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
          readOnly={readOnly}
          onVehicleSelect={selectVehicle}
          onRemoveVehicle={(id) => {
            const updatedVehicles = removeVehicle(id);
            if (updatedVehicles) {
              saveToHistory({ 
                vehicles: updatedVehicles, 
                paths, 
                annotations, 
                center, 
                zoom: mapRef.current?.getZoom() || 17 
              });
            }
          }}
        />
        
        <PathsLayer
          paths={paths}
          drawingLayerRef={drawingLayerRef}
          currentPathPoints={currentPathPoints}
          selectedVehicle={selectedVehicle}
          vehicles={vehicles}
        />
        
        <MapInitializer onMapReady={handleMapReady} />
      </MapContainer>
    </div>
  );
};

export default InteractiveScheme;
