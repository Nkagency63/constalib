
import { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAtom } from 'jotai';
import MapToolbar from './MapToolbar';
import VehicleMarker from './VehicleMarker';
import { generateVehicle } from './utils';
import {
  vehiclesAtom,
  selectedVehicleAtom,
  zoomAtom,
  historyAtom,
  historyIndexAtom,
  canUndoAtom,
  canRedoAtom,
} from './state';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapControls = ({ zoom }: { zoom: number }) => {
  const map = useMap();
  map.setZoom(zoom);
  return null;
};

const VehicleMap = () => {
  const [vehicles, setVehicles] = useAtom(vehiclesAtom);
  const [selectedVehicle, setSelectedVehicle] = useAtom(selectedVehicleAtom);
  const [zoom, setZoom] = useAtom(zoomAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [historyIndex, setHistoryIndex] = useAtom(historyIndexAtom);
  const [canUndo] = useAtom(canUndoAtom);
  const [canRedo] = useAtom(canRedoAtom);
  
  const defaultCenter: L.LatLngExpression = [48.8566, 2.3522];
  
  const addVehicle = () => {
    const newVehicle = generateVehicle(vehicles, defaultCenter);
    const newVehicles = [...vehicles, newVehicle];
    setVehicles(newVehicles);
    
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, newVehicles]);
    setHistoryIndex(prevIndex => prevIndex + 1);
    setSelectedVehicle(newVehicle.id);
  };
  
  const rotateVehicle = (vehicleId: string, angle: number) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, rotation: vehicle.rotation + angle } 
        : vehicle
    );
    
    setVehicles(updatedVehicles);
    
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, updatedVehicles]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };
  
  const removeVehicle = (vehicleId: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    setVehicles(updatedVehicles);
    
    if (selectedVehicle === vehicleId) {
      setSelectedVehicle(null);
    }
    
    if (historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1));
    }
    
    setHistory(prevHistory => [...prevHistory, updatedVehicles]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setVehicles(history[historyIndex - 1]);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setVehicles(history[historyIndex + 1]);
    }
  };
  
  return (
    <div className="w-full">
      <MapToolbar
        onAddVehicle={addVehicle}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={() => setZoom(prev => Math.min(prev + 1, 22))}
        onZoomOut={() => setZoom(prev => Math.max(prev - 1, 1))}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <div className="relative w-full h-[400px] border border-constalib-gray rounded-lg overflow-hidden mb-4">
        <MapContainer 
          defaultCenter={defaultCenter}
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
          
          <MapControls zoom={zoom} />
        </MapContainer>
      </div>
      
      <div className="text-sm text-constalib-dark-gray">
        <p>Glissez les véhicules pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default VehicleMap;
