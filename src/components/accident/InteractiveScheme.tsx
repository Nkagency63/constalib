
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { v4 as uuidv4 } from 'uuid';
import L from 'leaflet';
import CanvasToolbar from './scheme/CanvasToolbar';
import MapInitializer from './scheme/MapInitializer';
import SchemeToolbar from './scheme/SchemeToolbar';
import VehiclesLayer from './scheme/VehiclesLayer';
import PathsLayer from './scheme/PathsLayer';
import { useVehicles, VEHICLE_COLORS } from './hooks/useVehicles';
import { usePaths } from './hooks/usePaths';
import { useSchemeMap } from './hooks/useSchemeMap';
import { useSchemeHistory } from './hooks/useSchemeHistory';
import type { SchemeData, Annotation, Vehicle } from './types';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface InteractiveSchemeProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
  readOnly?: boolean;
}

const InteractiveScheme = ({ formData, onUpdateSchemeData, readOnly = false }: InteractiveSchemeProps) => {
  // Custom hooks
  const { 
    vehicles, selectedVehicle, addVehicle, removeVehicle, 
    selectVehicle, setVehicles, rotateVehicle
  } = useVehicles();
  
  const {
    paths, setPaths, currentPathPoints, isDrawing,
    startPath, continuePath, completePath, resetPath
  } = usePaths();
  
  const { saveToHistory, handleUndo, handleRedo, canUndo, canRedo } = useSchemeHistory();
  
  // Local state
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Get default center coordinates from formData or use Paris as default
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];

  // Map click handler based on selected tool
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (readOnly) return;
    
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        if (vehicles.length < 4) {
          const updatedVehicles = addVehicle(e.latlng);
          if (updatedVehicles) {
            saveToHistory({ vehicles: updatedVehicles, paths, annotations, center, zoom: 17 });
            // Auto-center on vehicles when a new one is added
            centerOnVehicles(updatedVehicles);
          }
        } else {
          toast.warning("Maximum de 4 véhicules atteint");
        }
        break;
        
      case 'path':
        if (isDrawing) {
          continuePath(newPoint);
        } else if (selectedVehicle) {
          // Start drawing a path from the selected vehicle
          const vehicle = vehicles.find(v => v.id === selectedVehicle);
          if (vehicle) {
            startPath(vehicle.position, vehicle.id, vehicle.color);
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
        // In select mode, deselect current vehicle
        selectVehicle(null);
        break;
    }
  };

  const { mapRef, drawingLayerRef, handleMapReady, centerOnVehicles } = useSchemeMap({
    readOnly,
    handleMapClick,
    onReady: () => {
      setIsMapReady(true);
      
      // Initialize vehicles if none exist and we have formData
      if (formData?.geolocation?.lat && formData?.geolocation?.lng && vehicles.length === 0) {
        const initialVehicles: Vehicle[] = [];
        
        // Add vehicle A if we have data
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
        
        // Add vehicle B if we have data
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
        
        // Set initial vehicles if we have any
        if (initialVehicles.length > 0) {
          setVehicles(initialVehicles);
          saveToHistory({
            vehicles: initialVehicles,
            paths: [],
            annotations: [],
            center,
            zoom: 17
          });
          
          // Auto-center on vehicles after initialization
          setTimeout(() => centerOnVehicles(initialVehicles), 300);
        }
      }
    }
  });

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

  // Handle undo with current state
  const handleUndoWrapper = () => {
    if (!canUndo) return;
    
    const currentState = { 
      vehicles, 
      paths, 
      annotations, 
      center, 
      zoom: mapRef.current?.getZoom() || 17 
    };
    
    const prevState = handleUndo(currentState);
    setVehicles(prevState.vehicles);
    setPaths(prevState.paths);
    setAnnotations(prevState.annotations);
    
    // Auto-center on vehicles after undo
    if (prevState.vehicles.length > 0) {
      setTimeout(() => centerOnVehicles(prevState.vehicles), 100);
    }
  };

  // Handle redo with current state
  const handleRedoWrapper = () => {
    if (!canRedo) return;
    
    const currentState = { 
      vehicles, 
      paths, 
      annotations, 
      center, 
      zoom: mapRef.current?.getZoom() || 17 
    };
    
    const nextState = handleRedo(currentState);
    setVehicles(nextState.vehicles);
    setPaths(nextState.paths);
    setAnnotations(nextState.annotations);
    
    // Auto-center on vehicles after redo
    if (nextState.vehicles.length > 0) {
      setTimeout(() => centerOnVehicles(nextState.vehicles), 100);
    }
  };

  // Center on vehicles when they change
  useEffect(() => {
    if (vehicles.length > 0 && isMapReady) {
      centerOnVehicles(vehicles);
    }
  }, [vehicles.length, isMapReady]);

  // Update scheme data when state changes
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

  // Handle key down events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readOnly || !selectedVehicle) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          rotateVehicle(selectedVehicle, -45);
          break;
        case 'ArrowRight':
          rotateVehicle(selectedVehicle, 45);
          break;
        case 'Delete':
        case 'Backspace':
          removeVehicle(selectedVehicle);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVehicle, readOnly]);

  // Implémentation de la fonction d'exportation d'image
  const handleExportImage = () => {
    if (!mapRef.current) {
      toast.error("Impossible d'exporter la carte");
      return;
    }

    try {
      // Crée un élément pour contenir une copie de la carte
      const mapContainer = mapRef.current.getContainer();
      const clonedMap = mapContainer.cloneNode(true) as HTMLElement;
      
      // Applique des styles pour l'export
      clonedMap.style.width = '1200px';
      clonedMap.style.height = '800px';
      
      // Crée une nouvelle div pour contenir la capture
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.appendChild(clonedMap);
      document.body.appendChild(container);
      
      // Utilise html2canvas pour créer une image (simulation)
      setTimeout(() => {
        document.body.removeChild(container);
        toast.success("Export d'image simulé - cette fonctionnalité nécessite html2canvas");
      }, 1000);
      
      toast.info("Préparation de l'image...");
    } catch (error) {
      toast.error("Erreur lors de l'exportation de l'image");
      console.error("Erreur d'exportation:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
        {!readOnly && (
          <CanvasToolbar 
            onAddVehicle={() => {
              if (mapRef.current && vehicles.length < 4) {
                const center = mapRef.current.getCenter();
                const updatedVehicles = addVehicle(center);
                if (updatedVehicles) {
                  saveToHistory({ 
                    vehicles: updatedVehicles, 
                    paths, 
                    annotations, 
                    center: [center.lat, center.lng], 
                    zoom: mapRef.current.getZoom() 
                  });
                  // Auto-center on vehicles when a new one is added
                  centerOnVehicles(updatedVehicles);
                }
              } else {
                toast.warning("Maximum de 4 véhicules atteint");
              }
            }}
            onUndo={handleUndoWrapper}
            onRedo={handleRedoWrapper}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            canUndo={canUndo}
            canRedo={canRedo}
            onExportImage={handleExportImage}
            onCenterVehicles={() => centerOnVehicles(vehicles)}
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
          zoomControl={false}
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
            onRemoveVehicle={removeVehicle}
            onRotateVehicle={rotateVehicle}
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

        <div className="bg-white p-2 text-xs text-gray-500 border-t">
          {vehicles.length === 0 ? (
            <p>Cliquez sur la carte pour ajouter des véhicules, trajectoires, et annotations</p>
          ) : (
            <p>
              {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} • 
              {paths.length} trajectoire{paths.length > 1 ? 's' : ''} • 
              {annotations.length} annotation{annotations.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default InteractiveScheme;
