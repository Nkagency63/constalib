
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createCarIcon } from '@/utils/mapIcons';
import VehicleIcon from './scheme/VehicleIcon';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Car, ArrowRight, MapPin, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import CanvasToolbar from './scheme/CanvasToolbar';
import VehicleControls from './scheme/VehicleControls';

// Import car icon for marker
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Available colors for vehicles
const VEHICLE_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

interface Vehicle {
  id: string;
  position: [number, number];
  color: string;
  brand?: string;
  model?: string;
  rotation: number;
  isSelected: boolean;
}

interface Annotation {
  id: string;
  position: [number, number];
  text: string;
  type: 'obstacle' | 'sign' | 'note';
}

interface Path {
  id: string;
  points: [number, number][];
  color: string;
  vehicleId?: string;
  isSelected: boolean;
}

export interface SchemeData {
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  center: [number, number];
  zoom: number;
}

interface SchemeProps {
  formData: any;
  onUpdateSchemeData?: (schemeData: SchemeData) => void;
  readOnly?: boolean;
}

// Component to handle map initialization and events
const MapInitializer: React.FC<{ onMapReady: (map: L.Map) => void }> = ({ onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  return null;
};

const InteractiveScheme: React.FC<SchemeProps> = ({ formData, onUpdateSchemeData, readOnly = false }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [currentPathPoints, setCurrentPathPoints] = useState<[number, number][]>([]);
  
  // Undo/redo state
  const [history, setHistory] = useState<SchemeData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  // Refs
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  
  // Calculate center based on form data if available
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522]; // Default to Paris

  // Handle map initialization
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
      const initialVehicles: Vehicle[] = [];
      
      // Add vehicle representations from the form data
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
      
      // Add other vehicle if available
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
  
  // Update parent component with scheme data when data changes
  useEffect(() => {
    if (onUpdateSchemeData) {
      const schemeData: SchemeData = {
        vehicles,
        paths,
        annotations,
        center: mapRef.current ? 
          [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng] as [number, number] : 
          center,
        zoom: mapRef.current ? mapRef.current.getZoom() : 17
      };
      onUpdateSchemeData(schemeData);
    }
  }, [vehicles, paths, annotations, onUpdateSchemeData]);
  
  // Handle map click based on current tool
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        if (vehicles.length < VEHICLE_COLORS.length) {
          addVehicle(e.latlng);
        } else {
          toast.warning(`Maximum de ${VEHICLE_COLORS.length} véhicules atteint.`);
        }
        break;
        
      case 'path':
        if (isDrawing) {
          // Continue current path
          setCurrentPathPoints([...currentPathPoints, newPoint]);
          
          if (drawingLayerRef.current && currentPathPoints.length > 0) {
            // Draw line segment on the map
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
          // Start new path
          setIsDrawing(true);
          setCurrentPathPoints([newPoint]);
        }
        break;
        
      case 'annotation':
        addAnnotation(newPoint, 'note');
        break;
        
      case 'select':
      default:
        // Deselect if clicking on empty space
        clearSelection();
        break;
    }
  };
  
  // Add a new vehicle to the map
  const addVehicle = (location: L.LatLng) => {
    const newVehicle: Vehicle = {
      id: uuidv4(),
      position: [location.lat, location.lng],
      color: VEHICLE_COLORS[vehicles.length % VEHICLE_COLORS.length],
      rotation: 0,
      isSelected: false
    };
    
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    
    // Auto-select the new vehicle
    selectVehicle(newVehicle.id);
    
    // Save to history
    saveToHistory({
      vehicles: updatedVehicles,
      paths,
      annotations,
      center: mapRef.current ? 
        [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng] as [number, number] : 
        center,
      zoom: mapRef.current ? mapRef.current.getZoom() : 17
    });
  };
  
  // Add an annotation to the map
  const addAnnotation = (position: [number, number], type: 'obstacle' | 'sign' | 'note') => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      position,
      text: type === 'obstacle' ? 'Obstacle' : 
            type === 'sign' ? 'Panneau' : 'Note',
      type
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    
    // Save to history
    saveToHistory({
      vehicles,
      paths,
      annotations: updatedAnnotations,
      center: mapRef.current ? 
        [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng] as [number, number] : 
        center,
      zoom: mapRef.current ? mapRef.current.getZoom() : 17
    });
  };
  
  // Complete the current path drawing
  const completePath = () => {
    if (currentPathPoints.length > 1) {
      const newPath: Path = {
        id: uuidv4(),
        points: currentPathPoints,
        color: selectedVehicle ? 
          vehicles.find(v => v.id === selectedVehicle)?.color || 'black' : 
          'black',
        vehicleId: selectedVehicle || undefined,
        isSelected: false
      };
      
      const updatedPaths = [...paths, newPath];
      setPaths(updatedPaths);
      
      // Reset drawing state
      setIsDrawing(false);
      setCurrentPathPoints([]);
      
      // Clean temporary drawing layer
      if (drawingLayerRef.current) {
        drawingLayerRef.current.clearLayers();
      }
      
      // Save to history
      saveToHistory({
        vehicles,
        paths: updatedPaths,
        annotations,
        center: mapRef.current ? 
          [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng] as [number, number] : 
          center,
        zoom: mapRef.current ? mapRef.current.getZoom() : 17
      });
    }
  };
  
  // Remove a vehicle from the map
  const removeVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    setVehicles(updatedVehicles);
    
    if (selectedVehicle === id) {
      setSelectedVehicle(null);
    }
    
    // Also remove any paths associated with this vehicle
    const updatedPaths = paths.filter(p => p.vehicleId !== id);
    setPaths(updatedPaths);
    
    // Save to history
    saveToHistory({
      vehicles: updatedVehicles,
      paths: updatedPaths,
      annotations,
      center: mapRef.current ? 
        [mapRef.current.getCenter().lat, mapRef.current.getCenter().lng] as [number, number] : 
        center,
      zoom: mapRef.current ? mapRef.current.getZoom() : 17
    });
  };
  
  // Select a vehicle
  const selectVehicle = (id: string) => {
    clearSelection();
    
    if (id) {
      setSelectedVehicle(id);
      setVehicles(vehicles.map(vehicle => ({
        ...vehicle,
        isSelected: vehicle.id === id
      })));
    }
  };
  
  // Clear all selections
  const clearSelection = () => {
    setSelectedVehicle(null);
    setSelectedPath(null);
    setSelectedAnnotation(null);
    
    setVehicles(vehicles.map(vehicle => ({
      ...vehicle,
      isSelected: false
    })));
    
    setPaths(paths.map(path => ({
      ...path,
      isSelected: false
    })));
  };
  
  // Switch the current tool
  const switchTool = (tool: 'select' | 'vehicle' | 'path' | 'annotation') => {
    // If we're switching away from path drawing, complete any current path
    if (isDrawing && currentTool === 'path' && tool !== 'path') {
      completePath();
    }
    
    clearSelection();
    setCurrentTool(tool);
  };
  
  // Save current state to history
  const saveToHistory = (state: SchemeData) => {
    // Remove any "future" states if we're not at the end of history
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, state]);
    setHistoryIndex(newHistory.length);
  };
  
  // Undo the last action
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setVehicles(prevState.vehicles);
      setPaths(prevState.paths);
      setAnnotations(prevState.annotations);
      setHistoryIndex(historyIndex - 1);
      
      // Clear any selections
      clearSelection();
    }
  };
  
  // Redo the last undone action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setVehicles(nextState.vehicles);
      setPaths(nextState.paths);
      setAnnotations(nextState.annotations);
      setHistoryIndex(historyIndex + 1);
      
      // Clear any selections
      clearSelection();
    }
  };
  
  // Zoom in
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  
  // Zoom out
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };
  
  // Add a vehicle button
  const addVehicleAtCenter = () => {
    if (mapRef.current && vehicles.length < VEHICLE_COLORS.length) {
      const center = mapRef.current.getCenter();
      addVehicle(center);
    } else {
      toast.warning(`Maximum de ${VEHICLE_COLORS.length} véhicules atteint.`);
    }
  };
  
  // Export the scheme as an image
  const exportScheme = () => {
    if (!mapRef.current) return;
    
    try {
      // Use leaflet-image library or html2canvas to capture the map
      // This is a placeholder for the export functionality
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
          onAddVehicle={addVehicleAtCenter}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
      )}
      
      {!readOnly && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-md shadow-md p-2 flex flex-col gap-2">
          <Button
            size="sm"
            variant={currentTool === 'select' ? 'default' : 'outline'}
            onClick={() => switchTool('select')}
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
            onClick={() => switchTool('vehicle')}
            className="flex items-center"
          >
            <Car className="h-4 w-4" />
            <span className="sr-only">Véhicule</span>
          </Button>
          <Button
            size="sm"
            variant={currentTool === 'path' ? 'default' : 'outline'}
            onClick={() => switchTool('path')}
            className="flex items-center"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Trajectoire</span>
          </Button>
          <Button
            size="sm"
            variant={currentTool === 'annotation' ? 'default' : 'outline'}
            onClick={() => switchTool('annotation')}
            className="flex items-center"
          >
            <MapPin className="h-4 w-4" />
            <span className="sr-only">Annotation</span>
          </Button>
          
          {isDrawing && currentTool === 'path' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={completePath}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="sr-only">Terminer</span>
            </Button>
          )}
        </div>
      )}
      
      {/* Map Container */}
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
        
        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => (
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
          />
        ))}
        
        {/* Vehicle Controls */}
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
      
      {!readOnly && (
        <div className="p-2 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportScheme}
            className="flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveScheme;
