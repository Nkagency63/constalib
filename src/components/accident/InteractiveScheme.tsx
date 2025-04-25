import React, { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { v4 as uuidv4 } from 'uuid';
import VehicleIcon from './scheme/VehicleIcon';
import CanvasToolbar from './scheme/CanvasToolbar';
import VehicleControls from './scheme/VehicleControls';
import MapInitializer from './scheme/MapInitializer';
import SchemeToolbar from './scheme/SchemeToolbar';
import { useVehicles } from './hooks/useVehicles';
import { usePaths } from './hooks/usePaths';
import { useSchemeMap } from './hooks/useSchemeMap';
import { useSchemeHistory } from './hooks/useSchemeHistory';
import type { SchemeData } from './types';

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
  const [annotations, setAnnotations] = React.useState<Array<any>>([]);

  // Calculate center based on form data if available
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522]; // Default to Paris

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        if (vehicles.length < VEHICLE_COLORS.length) {
          const updatedVehicles = addVehicle(e.latlng);
          if (updatedVehicles) {
            saveToHistory({ vehicles: updatedVehicles, paths, annotations, center, zoom: 17 });
          }
        }
        break;
      case 'path':
        if (isDrawing) {
          continuePath(newPoint);
          if (drawingLayerRef.current && currentPathPoints.length > 0) {
            const lastPoint = currentPathPoints[currentPathPoints.length - 1];
            L.polyline([lastPoint, newPoint], {
              color: selectedVehicle ? 
                vehicles.find(v => v.id === selectedVehicle)?.color || 'black' : 
                'black',
              weight: 3,
              opacity: 0.7
            }).addTo(drawingLayerRef.current);
          }
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

  const initializeScheme = () => {
    if (formData?.geolocation?.lat && formData?.geolocation?.lng && vehicles.length === 0) {
      const initialVehicles: any[] = [];
      
      if (formData.vehicleBrand && formData.vehicleModel) {
        initialVehicles.push({
          id: uuidv4(),
          position: [
            formData.geolocation.lat + 0.0002, 
            formData.geolocation.lng - 0.0002
          ],
          color: VEHICLE_COLORS[0],
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
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
          color: VEHICLE_COLORS[1],
          brand: formData.otherVehicle.brand,
          model: formData.otherVehicle.model,
          rotation: 0,
          isSelected: false
        });
      }
      
      if (initialVehicles.length > 0) {
        setVehicles(initialVehicles);
        saveToHistory({
          vehicles: initialVehicles,
          paths: [],
          annotations: [],
          center,
          zoom: 17
        });
      }
    }
  };

  const { mapRef, drawingLayerRef, handleMapReady } = useSchemeMap(
    readOnly,
    handleMapClick,
    initializeScheme
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

  useEffect(() => {
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
            if (mapRef.current) {
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
          onUndo={() => {
            const prevState = handleUndo({ vehicles, paths, annotations, center, zoom: 17 });
            setVehicles(prevState.vehicles);
            setPaths(prevState.paths);
            setAnnotations(prevState.annotations);
          }}
          onRedo={() => {
            const nextState = handleRedo({ vehicles, paths, annotations, center, zoom: 17 });
            setVehicles(nextState.vehicles);
            setPaths(nextState.paths);
            setAnnotations(nextState.annotations);
          }}
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
        
        {vehicles.map((vehicle, index) => (
          <VehicleIcon
            key={vehicle.id}
            label={vehicle.brand || "Véhicule"}
            style={{
              position: 'absolute',
              zIndex: 1000,
              transform: `translate(-50%, -50%) rotate(${vehicle.rotation}deg)`,
            }}
            color={vehicle.color}
            isSelected={vehicle.isSelected}
            onMouseDown={() => !readOnly && selectVehicle(vehicle.id)}
            isVehicleA={index === 0}
          />
        ))}
        
        {selectedVehicle && !readOnly && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
            {vehicles.map(vehicle => (
              vehicle.id === selectedVehicle && (
                <VehicleControls
                  key={vehicle.id}
                  vehicleId={vehicle.id}
                  onRemove={(id) => {
                    const updatedVehicles = removeVehicle(id);
                    saveToHistory({ 
                      vehicles: updatedVehicles, 
                      paths: paths.filter(p => p.vehicleId !== id),
                      annotations, 
                      center, 
                      zoom: 17 
                    });
                  }}
                />
              )
            ))}
          </div>
        )}
        
        <MapInitializer onMapReady={handleMapReady} />
      </MapContainer>
    </div>
  );
};

export default InteractiveScheme;
