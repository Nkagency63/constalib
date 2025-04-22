
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CarFront } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fix for default icon issue in Leaflet with webpack/vite
// We need to redefine the default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for accident marker
const accidentIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2FyIj48cGF0aCBkPSJNMTkgMTdINUwzIDE1VjEzSDIxVjE1TDE5IDE3WiIvPjxwYXRoIGQ9Ik02IDEzVjdDNiA1Ljg5NTQzIDYuODk1NDMgNSA4IDVIMTZDMTcuMTA0NiA1IDE4IDUuODk1NDMgMTggN1YxMyIvPjwvc3ZnPg==',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
  className: 'bg-red-500 p-1 rounded-full'
});

interface AccidentMapProps {
  lat: number;
  lng: number;
  address: string;
}

const AccidentMap = ({ lat, lng, address }: AccidentMapProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const position: [number, number] = [lat, lng];

  useEffect(() => {
    if (!lat || !lng) return;
    
    // Set loading to false after a small delay to ensure the map has time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [lat, lng]);

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100 animate-pulse" style={{ height: '300px' }}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-gray-400">Chargement de la carte...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: '300px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={accidentIcon}>
          <Popup>
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AccidentMap;
