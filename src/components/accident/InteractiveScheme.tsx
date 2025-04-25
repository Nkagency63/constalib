import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createCarIcon } from '@/utils/mapIcons';
import VehicleIcon from './scheme/VehicleIcon';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Car } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import CanvasToolbar from './scheme/CanvasToolbar';
import VehicleControls from './scheme/VehicleControls';
import { FormData } from './types';

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
  isSelected: boolean;
}

interface SchemeProps {
  formData: FormData;
  onUpdateSchemeData?: (vehicles: Vehicle[]) => void;
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
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [lines, setLines] = useState<L.Polyline[]>([]);
  const [currentLine, setCurrentLine] = useState<L.LatLng[]>([]);
  const [lastPoint, setLastPoint] = useState<L.LatLng | null>(null);
  
  // Refs
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  
  // Calculate center based on form data if available
  const center: [number, number] = formData.geolocation?.lat && formData.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522]; // Default to Paris

  // Handle map initialization
  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    
    // Create a layer for drawings
    drawingLayerRef.current = L.layerGroup().addTo(map);
    
    if (!readOnly) {
      // Add click event for vehicle placement
      map.on('click', handleMapClick);
    }
    
    // Attempt to add initial vehicles based on form data
    initializeVehicles();
  };
  
  // Initialize vehicles based on formData if available
  const initializeVehicles = () => {
    // This is where you would populate vehicles from saved data
    // For now, let's add demo vehicles if there's accident location data
    if (formData.geolocation?.lat && formData.geolocation?.lng && vehicles.length === 0) {
      // Add your vehicle and other vehicle to the map
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
          isSelected: false
        });
      }
      
      // Add other vehicle if available
      if (formData.otherVehicle.brand && formData.otherVehicle.model) {
        initialVehicles.push({
          id: uuidv4(),
          position: [
            formData.geolocation.lat - 0.0002, 
            formData.geolocation.lng + 0.0002
          ],
          color: VEHICLE_COLORS[1],
          brand: formData.otherVehicle.brand,
          model: formData.otherVehicle.model,
          isSelected: false
        });
      }
      
      if (initialVehicles.length > 0) {
        setVehicles(initialVehicles);
      }
    }
  };
  
  // Update parent component with scheme data when vehicles change
  useEffect(() => {
    if (onUpdateSchemeData) {
      onUpdateSchemeData(vehicles);
    }
  }, [vehicles, onUpdateSchemeData]);
  
  // Handle map click to place vehicles or draw lines
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (drawing) {
      // Add point to current drawing line
      const newPoint = e.latlng;
      
      if (lastPoint) {
        // Create a line segment between last point and new point
        if (drawingLayerRef.current && mapRef.current) {
          const polyline = L.polyline([lastPoint, newPoint], {
            color: 'black',
            weight: 3,
          }).addTo(drawingLayerRef.current);
          
          setLines([...lines, polyline]);
          setCurrentLine([...currentLine, newPoint]);
        }
      } else {
        // First point in line
        setCurrentLine([newPoint]);
      }
      
      setLastPoint(newPoint);
    } else if (vehicles.length < VEHICLE_COLORS.length) {
      // Add new vehicle at click position
      addVehicle(e.latlng);
    } else {
      toast.warning(`Maximum de ${VEHICLE_COLORS.length} véhicules atteint.`);
    }
  };
  
  // Add a new vehicle to the map
  const addVehicle = (location: L.LatLng) => {
    const newVehicle: Vehicle = {
      id: uuidv4(),
      position: [location.lat, location.lng],
      color: VEHICLE_COLORS[vehicles.length % VEHICLE_COLORS.length],
      isSelected: false
    };
    
    setVehicles([...vehicles, newVehicle]);
    
    // Auto-select the new vehicle
    setSelectedVehicle(newVehicle.id);
    updateSelectedStatus(newVehicle.id);
  };
  
  // Remove a vehicle from the map
  const removeVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    if (selectedVehicle === id) {
      setSelectedVehicle(null);
    }
  };
  
  // Select a vehicle
  const selectVehicle = (id: string) => {
    if (selectedVehicle === id) {
      setSelectedVehicle(null);
      updateSelectedStatus(null);
    } else {
      setSelectedVehicle(id);
      updateSelectedStatus(id);
    }
  };
  
  // Update the isSelected status for all vehicles
  const updateSelectedStatus = (selectedId: string | null) => {
    setVehicles(vehicles.map(vehicle => ({
      ...vehicle,
      isSelected: vehicle.id === selectedId
    })));
  };
  
  // Clear all drawings
  const clearDrawings = () => {
    if (drawingLayerRef.current) {
      drawingLayerRef.current.clearLayers();
      setLines([]);
      setCurrentLine([]);
      setLastPoint(null);
    }
  };
  
  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setDrawing(!drawing);
    if (drawing) {
      // Exit drawing mode
      setLastPoint(null);
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
  
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
      {!readOnly && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={addVehicleAtCenter} 
            className="bg-white"
            title="Ajouter un véhicule"
          >
            <Car className="h-4 w-4 mr-1" />
            <span>Ajouter</span>
          </Button>
        </div>
      )}
      
      {!readOnly && (
        <CanvasToolbar 
          drawing={drawing} 
          onToggleDrawing={toggleDrawingMode} 
          onClear={clearDrawings} 
        />
      )}
      
      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={17}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
        whenReady={(mapEvent) => handleMapReady(mapEvent.target)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => (
          <VehicleIcon
            key={vehicle.id}
            position={vehicle.position}
            color={vehicle.color}
            isSelected={vehicle.isSelected}
            onClick={() => !readOnly && selectVehicle(vehicle.id)}
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
    </div>
  );
};

export default InteractiveScheme;
