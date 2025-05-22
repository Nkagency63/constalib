
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle } from './types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Map, RotateCw, RotateCcw, Trash2, Car } from 'lucide-react';
import MapTools from './MapTools';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons for vehicles
const createVehicleIcon = (color: string, rotation: number, isSelected: boolean) => {
  return L.divIcon({
    className: 'vehicle-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 50px;
        border-radius: 5px;
        transform: rotate(${rotation}deg);
        border: ${isSelected ? '2px solid black' : '1px solid rgba(0,0,0,0.5)'};
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <path d="M9 17h6"></path>
          <circle cx="17" cy="17" r="2"></circle>
        </svg>
      </div>
    `,
    iconSize: [30, 50],
    iconAnchor: [15, 25],
  });
};

// Component to recenter map when coordinates change
function SetViewComponent({ coords }: { coords: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15);
    }
  }, [coords, map]);
  
  return null;
}

interface MapViewProps {
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  onVehicleSelect: (id: string) => void;
  onVehicleMove: (id: string, lat: number, lng: number) => void;
  onVehicleRotate: (id: string, angle: number) => void;
  onVehicleRemove: (id: string) => void;
  onVehicleAdd: () => void;
}

const MapView = ({
  geolocation,
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  onVehicleMove,
  onVehicleRotate,
  onVehicleRemove,
  onVehicleAdd
}: MapViewProps) => {
  const [mapTools, setMapTools] = useState<'arrow' | 'impact' | 'sign' | null>(null);
  const [defaultCenter] = useState({
    // Coordonnées par défaut (Paris) si aucune géolocalisation n'est fournie
    lat: 48.8566,
    lng: 2.3522
  });
  
  // If no geolocation is provided, display a message
  if (!geolocation?.lat || !geolocation?.lng) {
    return (
      <div className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <Map className="h-4 w-4 text-amber-500 mr-2" />
          <AlertDescription className="text-amber-800 text-sm">
            Veuillez d'abord définir l'emplacement de l'accident dans l'onglet "Localisation".
          </AlertDescription>
        </Alert>
        
        <div className="h-[400px] rounded-lg overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center">
          <div className="text-center p-4">
            <Map className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Aucune localisation définie</p>
          </div>
        </div>
      </div>
    );
  }
  
  const center: [number, number] = [
    geolocation.lat || defaultCenter.lat,
    geolocation.lng || defaultCenter.lng
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onVehicleAdd}
            className="flex items-center"
          >
            <Car className="h-4 w-4 mr-2" />
            Ajouter véhicule
          </Button>
          
          <MapTools 
            selectedTool={mapTools}
            onToolSelect={setMapTools}
          />
        </div>
        
        {selectedVehicle && (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVehicleRotate(selectedVehicle, -45)}
              className="flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              -45°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVehicleRotate(selectedVehicle, 45)}
              className="flex items-center"
            >
              <RotateCw className="h-4 w-4 mr-1" />
              +45°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVehicleRemove(selectedVehicle)}
              className="text-red-500 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        )}
      </div>
      
      <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300 bg-white">
        <MapContainer 
          center={center} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }} 
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <SetViewComponent coords={center} />
          
          {/* Add markers for each vehicle */}
          {vehicles.map((vehicle) => {
            const lat = vehicle.mapLat || center[0];
            const lng = vehicle.mapLng || center[1];
            const isSelected = vehicle.id === selectedVehicle;
            
            return (
              <Marker
                key={vehicle.id}
                position={[lat, lng]}
                icon={createVehicleIcon(vehicle.color, vehicle.rotation, isSelected)}
                draggable={true}
                eventHandlers={{
                  click: () => onVehicleSelect(vehicle.id),
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    onVehicleMove(vehicle.id, position.lat, position.lng);
                  }
                }}
              >
                <Popup>
                  <div className="text-center">
                    <strong>{vehicle.label}</strong>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* Add a location marker at the accident location */}
          <Marker position={center}>
            <Popup>
              <div>
                <strong>Lieu de l'accident</strong>
                <p className="text-xs">{geolocation.address}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <p className="text-xs text-gray-500">{geolocation.address}</p>
    </div>
  );
};

export default MapView;
