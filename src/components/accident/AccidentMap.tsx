
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import MapInitializer from './MapInitializer';
import { GeolocationData } from '@/hooks/accident/useLocationForm';

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
  accuracy?: number;
  onMapReady?: (map: L.Map) => void;
}

const AccidentMap: React.FC<AccidentMapProps> = ({ 
  lat, 
  lng, 
  address,
  accuracy,
  onMapReady 
}) => {
  // Calculate zoom level based on accuracy if provided
  const calculateZoom = () => {
    if (!accuracy) return 15;
    if (accuracy < 50) return 18;
    if (accuracy < 100) return 17;
    if (accuracy < 500) return 16;
    if (accuracy < 1000) return 15;
    return 14;
  };

  const zoom = calculateZoom();

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden">
      <MapContainer 
        center={[lat, lng]} 
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
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

        {/* Add accuracy circle if accuracy is provided */}
        {accuracy && accuracy > 0 && (
          <Circle 
            center={[lat, lng]}
            radius={accuracy}
            pathOptions={{ 
              fillColor: '#3388ff', 
              fillOpacity: 0.1, 
              weight: 1,
              color: '#3388ff',
              opacity: 0.5
            }}
          >
            <Popup>
              Précision: ~{accuracy < 1000 ? `${Math.round(accuracy)} m` : `${(accuracy/1000).toFixed(1)} km`}
            </Popup>
          </Circle>
        )}
        
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
