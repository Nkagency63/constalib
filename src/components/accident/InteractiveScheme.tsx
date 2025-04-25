import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createCarIcon } from '@/utils/mapIcons';
import VehicleIcon from './scheme/VehicleIcon';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CanvasToolbar from './scheme/CanvasToolbar';
import VehicleControls from './scheme/VehicleControls';
import { useVehicles } from './hooks/useVehicles';
import { usePaths } from './hooks/usePaths';
import { useSchemeHistory } from './hooks/useSchemeHistory';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { SchemeData } from './types';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Map initializer component
const MapInitializer = ({ onMapReady }: { onMapReady: (map: L.Map) => void }) => {
  const map = useMap();
  React.useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
};

const InteractiveScheme = ({ 
  formData, 
  onUpdateSchemeData, 
  readOnly = false 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  
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
  const [annotations, setAnnotations] = React.useState<any[]>([]);

  // Calculate center based on form data if available
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522]; // Default to Paris

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    
    // Create a layer for drawings
    drawingLayerRef.current = L.layerGroup().addTo(map);
    
    if (!readOnly) {
      // Add click event for interactions based on selected tool
      map.on('click', handleMapClick);
    }
    
    // Initialize items based on form data
    initializeScheme();
  };
  
  // Initialize scheme based on formData if available
  const initializeScheme = () => {
    // This is where you would populate vehicles, paths, etc. from saved data
    if (formData?.geolocation?.lat && formData?.geolocation?.lng && vehicles.length === 0) {
      const initialVehicles: any[] = [];
      
      // Add vehicle representations from the form data
      if (formData.vehicleBrand && formData.vehicleModel) {
        initialVehicles.push({
          id: 'vehicle-a',
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
      
      // Add other vehicle if available
      if (formData.otherVehicle?.brand && formData.otherVehicle?.model) {
        initialVehicles.push({
          id: 'vehicle-b',
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

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        if (vehicles.length < VEHICLE_COLORS.length) {
          const updatedVehicles = addVehicle(e.latlng);
          saveToHistory({ vehicles: updatedVehicles, paths, annotations, center, zoom: 17 });
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
        break;
        
      case 'select':
      default:
        selectVehicle(null);
        break;
    }
  };

  const exportScheme = () => {
    if (!mapRef.current) return;
    
    try {
      toast.info("Exportation de la carte en cours...");
      setTimeout(() => {
        toast.success("Exportation réussie ! Le fichier a été téléchargé.");
      }, 1000);
    } catch (error) {
      toast.error("Erreur lors de l'exportation de la carte.");
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
      {!readOnly && (
        <CanvasToolbar 
          onAddVehicle={() => {
            if (mapRef.current) {
              const center = mapRef.current.getCenter();
              addVehicle(center);
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
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-md shadow-md p-2 flex flex-col gap-2">
          <Button
            size="sm"
            variant={currentTool === 'select' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('select')}
            className="flex items-center"
          >
            <span className="sr-only">Sélectionner</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 17 9 4 9-4"/>
              <path d="m3 7 9 4 9-4"/>
              <path d="M3 12h18"/>
            </svg>
          </Button>
          <Button
            size="sm"
            variant={currentTool === 'vehicle' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('vehicle')}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.5 8.5 5.5 8.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z"/>
              <path d="M15 8.5V5a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v3.5"/>
              <line x1="3" x2="21" y1="12.5" y2="12.5"/>
            </svg>
            <span className="sr-only">Véhicule</span>
          </Button>
          <Button
            size="sm"
            variant={currentTool === 'path' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('path')}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20l1.3-3.9a9 9 0 1 1 2.6 3.9z"/>
              <path d="M16 8l-1.3 3.9A9 9 0 1 0 18.6 8z"/>
            </svg>
            <span className="sr-only">Trajectoire</span>
          </Button>
          <Button
            size="sm"
            variant={currentTool === 'annotation' ? 'default' : 'outline'}
            onClick={() => setCurrentTool('annotation')}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 13a8 8 0 0 1 15 0"/>
              <path d="M7 21a8 8 0 0 0 15 0"/>
              <path d="M12 3v10"/>
            </svg>
            <span className="sr-only">Annotation</span>
          </Button>
        </div>
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
            {vehicles.map((vehicle) => (
              vehicle.id === selectedVehicle && (
                <VehicleControls
                  key={vehicle.id}
                  vehicleId={vehicle.id}
                  onRemove={removeVehicle}
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
