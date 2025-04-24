
import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Car, Undo, Redo, Plus, Minus, X } from 'lucide-react';
import { Button } from './ui/button';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Vehicle {
  id: string;
  position: L.LatLng;
  rotation: number;
  color: string;
  label: string;
}

interface VehicleMarkerProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRotate: (id: string, angle: number) => void;
  onRemove: (id: string) => void;
}

// Custom vehicle marker component
const VehicleMarker = ({ vehicle, isSelected, onSelect, onRotate, onRemove }: VehicleMarkerProps) => {
  const map = useMap();
  
  // Create custom icon for vehicle
  const vehicleIcon = L.divIcon({
    className: '',
    html: `
      <div style="position: relative;">
        <div style="
          width: 40px; 
          height: 80px; 
          background-color: ${vehicle.color}; 
          border-radius: 8px;
          transform: translate(-50%, -50%) rotate(${vehicle.rotation}deg);
          display: flex;
          align-items: center;
          justify-content: center;
          ${isSelected ? 'box-shadow: 0 0 0 4px #3b82f6;' : ''}
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <path d="M9 17h6"></path>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          padding: 0 4px;
          border-radius: 4px;
          font-size: 12px;
          color: #4b5563;
          white-space: nowrap;
        ">
          ${vehicle.label}
        </div>
        ${isSelected ? `
          <div style="
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 4px;
          ">
            <button class="vehicle-rotate-left" style="
              background-color: white;
              border-radius: 9999px;
              padding: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              cursor: pointer;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 15L8 11L4 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="vehicle-rotate-right" style="
              background-color: white;
              border-radius: 9999px;
              padding: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              cursor: pointer;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 15L16 11L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="vehicle-remove" style="
              background-color: white;
              border-radius: 9999px;
              padding: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              cursor: pointer;
              color: #ef4444;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [40, 80],
    iconAnchor: [20, 40],
  });
  
  const eventHandlers = {
    click: () => {
      onSelect(vehicle.id);
    }
  };
  
  useEffect(() => {
    if (!isSelected) return;
    
    // Find and attach event handlers to control buttons
    setTimeout(() => {
      const rotateLeftBtn = document.querySelector('.vehicle-rotate-left');
      const rotateRightBtn = document.querySelector('.vehicle-rotate-right');
      const removeBtn = document.querySelector('.vehicle-remove');
      
      if (rotateLeftBtn) {
        rotateLeftBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onRotate(vehicle.id, -45);
        });
      }
      
      if (rotateRightBtn) {
        rotateRightBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onRotate(vehicle.id, 45);
        });
      }
      
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onRemove(vehicle.id);
        });
      }
    }, 0);
    
    return () => {
      const rotateLeftBtn = document.querySelector('.vehicle-rotate-left');
      const rotateRightBtn = document.querySelector('.vehicle-rotate-right');
      const removeBtn = document.querySelector('.vehicle-remove');
      
      if (rotateLeftBtn) rotateLeftBtn.remove();
      if (rotateRightBtn) rotateRightBtn.remove();
      if (removeBtn) removeBtn.remove();
    };
  }, [isSelected, onRotate, onRemove, vehicle.id]);
  
  return (
    <Marker
      position={vehicle.position}
      icon={vehicleIcon}
      eventHandlers={eventHandlers}
    />
  );
};

const VehicleLeafletMap = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [zoom, setZoom] = useState(18); // Default zoom level
  const [history, setHistory] = useState<Vehicle[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [center] = useState<[number, number]>([48.8566, 2.3522]); // Default: Paris
  
  // Add vehicle to the map
  const addVehicle = () => {
    const colors = ['#ff9f43', '#0abde3', '#10ac84', '#ee5253'];
    const offset = 0.0001 * vehicles.length; // Small offset for each new vehicle
    
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      position: new L.LatLng(center[0] + offset, center[1] + offset),
      rotation: 0,
      color: colors[vehicles.length % colors.length],
      label: `Véhicule ${vehicles.length + 1}`
    };
    
    const newVehicles = [...vehicles, newVehicle];
    setVehicles(newVehicles);
    
    // Add to history
    if (historyIndex < history.length - 1) {
      // If we're in the middle of the history, truncate
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, newVehicles]);
    setHistoryIndex(prevIndex => prevIndex + 1);
    
    // Select the newly added vehicle
    setSelectedVehicle(newVehicle.id);
  };
  
  // Update vehicle position (handled by react-leaflet's draggable marker)
  const handlePositionChange = (vehicleId: string, newPosition: L.LatLng) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, position: newPosition } : vehicle
    );
    
    setVehicles(updatedVehicles);
    
    // Add to history
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, updatedVehicles]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };
  
  // Rotate vehicle
  const rotateVehicle = (vehicleId: string, angle: number) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, rotation: vehicle.rotation + angle } 
        : vehicle
    );
    
    setVehicles(updatedVehicles);
    
    // Add to history
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, updatedVehicles]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };
  
  // Remove vehicle
  const removeVehicle = (vehicleId: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    setVehicles(updatedVehicles);
    
    if (selectedVehicle === vehicleId) {
      setSelectedVehicle(null);
    }
    
    // Add to history
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, updatedVehicles]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };
  
  // Undo action
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setVehicles(history[historyIndex - 1]);
    }
  };
  
  // Redo action
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setVehicles(history[historyIndex + 1]);
    }
  };
  
  // Update zoom
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 1, 22));
  };
  
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 1, 1));
  };
  
  // Map controls component
  const MapControls = () => {
    const map = useMap();
    
    useEffect(() => {
      map.setZoom(zoom);
    }, [zoom, map]);
    
    return null;
  };
  
  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button variant="outline" onClick={addVehicle}>
          <Car className="w-4 h-4 mr-2" />
          Ajouter un véhicule
        </Button>
        
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={undo} 
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={redo} 
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Map */}
      <div className="relative w-full h-[400px] border border-constalib-gray rounded-lg overflow-hidden mb-4">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {vehicles.map(vehicle => (
            <VehicleMarker 
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicle === vehicle.id}
              onSelect={setSelectedVehicle}
              onRotate={rotateVehicle}
              onRemove={removeVehicle}
            />
          ))}
          
          <MapControls />
        </MapContainer>
      </div>
      
      {/* Instructions */}
      <div className="text-sm text-constalib-dark-gray">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleLeafletMap;

