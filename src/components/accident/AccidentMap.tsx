
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import MapInitializer from './MapInitializer';

// Fix Leaflet marker icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AccidentMapProps {
  lat: number;
  lng: number;
  address?: string;
  onMapReady?: (map: L.Map) => void;
}

const AccidentMap: React.FC<AccidentMapProps> = ({ lat, lng, address, onMapReady }) => {
  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden">
      <MapContainer 
        center={[lat, lng]} 
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            {address || `Latitude: ${lat}, Longitude: ${lng}`}
          </Popup>
        </Marker>
        {onMapReady && <MapInitializer onMapReady={onMapReady} />}
      </MapContainer>
      
      {address && (
        <div className="mt-2 text-sm text-constalib-dark-gray">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <p>{address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccidentMap;
