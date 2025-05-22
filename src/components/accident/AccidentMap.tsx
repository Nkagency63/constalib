
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';

// Create a custom accident icon
const createAccidentIcon = () => {
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2U1MzkxNSIvPjxwYXRoIGQ9Ik0xOSAxN0g1TDMgMTVWMTNIMjFWMTVMMTkgMTdaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNiAxM1Y3QzYgNS44OTU0MyA2Ljg5NTQzIDUgOCA1SDE2QzE3LjEwNDYgNSAxOCA1Ljg5NTQzIDE4IDdWMTMiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

interface AccidentMapProps {
  lat: number;
  lng: number;
  address: string;
  children?: React.ReactNode;
}

// Add a head script to load Leaflet CSS from CDN
const ensureLeafletCss = () => {
  if (typeof document !== 'undefined') {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }
};

const AccidentMap = ({ lat, lng, address, children }: AccidentMapProps) => {
  // Ensure Leaflet CSS is loaded
  React.useEffect(() => {
    ensureLeafletCss();
  }, []);

  // Fix Leaflet icon paths at runtime
  React.useEffect(() => {
    // This part is crucial because Leaflet's default icon paths are broken in bundled builds
    if (typeof window !== 'undefined' && window.L) {
      delete (window.L.Icon.Default.prototype as any)._getIconUrl;
      
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[lat, lng] as [number, number]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng] as [number, number]} icon={createAccidentIcon()}>
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
      </MapContainer>
    </div>
  );
};

export default AccidentMap;
