
import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';
import MapInitializer from './scheme/MapInitializer';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Create a custom accident icon
const accidentIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2U1MzkxNSIvPjxwYXRoIGQ9Ik0xOSAxN0g1TDMgMTVWMTNIMjFWMTVMMTkgMTdaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNiAxM1Y3QzYgNS44OTU0MyA2Ljg5NTQzIDUgOCA1SDE2QzE3LjEwNDYgNSAxOCA1Ljg5NTQzIDE4IDdWMTMiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

interface AccidentMapProps {
  lat: number;
  lng: number;
  address: string;
  children?: React.ReactNode;
}

const AccidentMap = ({ lat, lng, address, children }: AccidentMapProps) => {
  const mapInstanceRef = useRef(null);
  
  const handleMapReady = (map) => {
    if (mapInstanceRef.current) return;
    mapInstanceRef.current = map;
    
    // Safely invalidate size
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
        console.log("AccidentMap: Map size invalidated");
      }
    }, 100);
  };
  
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[lat, lng] as [number, number]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '100%' }}
        className="z-0"
        // Disable controls to minimize cleanup issues
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng] as [number, number]} icon={accidentIcon}>
          <Popup>
            <div className="text-sm font-medium">
              <p>{address}</p>
              <p className="text-xs text-constalib-dark-gray mt-1">
                Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
        {children}
        <MapInitializer onMapReady={handleMapReady} />
      </MapContainer>
    </div>
  );
};

export default AccidentMap;
