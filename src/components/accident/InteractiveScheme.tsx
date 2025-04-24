
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import VehicleIcon from './scheme/VehicleIcon';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
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
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Colors for vehicles A and B
const VEHICLE_COLORS = {
  A: '#3b82f6', // Bleu pour le véhicule A
  B: '#ef4444'  // Rouge pour le véhicule B
};

interface Vehicle {
  id: string;
  position: [number, number];
  color: string;
  brand?: string;
  model?: string;
  isSelected: boolean;
  label: 'A' | 'B';
}

interface InteractiveSchemeProps {
  formData: FormData;
  onUpdateSchemeData?: (vehicles: Vehicle[]) => void;
  readOnly?: boolean;
}

const InteractiveScheme: React.FC<InteractiveSchemeProps> = ({ 
  formData, 
  onUpdateSchemeData, 
  readOnly = false 
}) => {
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
    drawingLayerRef.current = L.layerGroup().addTo(map);
    
    if (!readOnly) {
      map.on('click', handleMapClick);
    }
    
    // Initialize vehicles
    initializeVehicles();
  };

  // Initialize vehicles based on formData if available
  const initializeVehicles = () => {
    if (formData.geolocation?.lat && formData.geolocation?.lng && vehicles.length === 0) {
      const initialVehicles: Vehicle[] = [];
      
      // Add vehicle A from form data
      if (formData.vehicleBrand && formData.vehicleModel) {
        initialVehicles.push({
          id: uuidv4(),
          position: [
            formData.geolocation.lat + 0.0002,
            formData.geolocation.lng - 0.0002
          ],
          color: VEHICLE_COLORS.A,
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          isSelected: false,
          label: 'A'
        });
      }
      
      // Add vehicle B if available
      if (formData.otherVehicle.brand && formData.otherVehicle.model) {
        initialVehicles.push({
          id: uuidv4(),
          position: [
            formData.geolocation.lat - 0.0002,
            formData.geolocation.lng + 0.0002
          ],
          color: VEHICLE_COLORS.B,
          brand: formData.otherVehicle.brand,
          model: formData.otherVehicle.model,
          isSelected: false,
          label: 'B'
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
        if (drawingLayerRef.current && mapRef.current) {
          const polyline = L.polyline([lastPoint, newPoint], {
            color: 'black',
            weight: 3,
          }).addTo(drawingLayerRef.current);
          
          setLines([...lines, polyline]);
          setCurrentLine([...currentLine, newPoint]);
        }
      } else {
        setCurrentLine([newPoint]);
      }
      setLastPoint(newPoint);
    } else if (vehicles.length < 2) {
      addVehicle(e.latlng);
    } else {
      toast.warning("Maximum de 2 véhicules atteint (A et B).");
    }
  };

  // Add a new vehicle to the map
  const addVehicle = (location: L.LatLng) => {
    const isVehicleA = vehicles.length === 0;
    const newVehicle: Vehicle = {
      id: uuidv4(),
      position: [location.lat, location.lng],
      color: isVehicleA ? VEHICLE_COLORS.A : VEHICLE_COLORS.B,
      isSelected: false,
      label: isVehicleA ? 'A' : 'B'
    };
    
    setVehicles([...vehicles, newVehicle]);
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
      setLastPoint(null);
    }
  };

  // Add a vehicle button
  const addVehicleAtCenter = () => {
    if (mapRef.current && vehicles.length < 2) {
      const center = mapRef.current.getCenter();
      addVehicle(center);
    } else {
      toast.warning("Maximum de 2 véhicules atteint (A et B).");
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
            disabled={vehicles.length >= 2}
            title={vehicles.length === 0 ? "Ajouter le véhicule A" : vehicles.length === 1 ? "Ajouter le véhicule B" : "Maximum atteint"}
          >
            <Car className="h-4 w-4 mr-1" />
            <span>Ajouter {vehicles.length === 0 ? "A" : "B"}</span>
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
      
      <MapContainer
        center={center}
        zoom={17}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
        whenReady={(map: L.Map) => handleMapReady(map)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {vehicles.map((vehicle) => (
          <VehicleIcon
            key={vehicle.id}
            position={vehicle.position}
            color={vehicle.color}
            isSelected={vehicle.isSelected}
            onClick={() => !readOnly && selectVehicle(vehicle.id)}
            label={vehicle.label}
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
      </MapContainer>
    </div>
  );
};

export default InteractiveScheme;
