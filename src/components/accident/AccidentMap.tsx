
import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import MapInitializer from './MapInitializer';

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
  const mapInstanceRef = useRef<any>(null);
  const [mapKey, setMapKey] = useState(Date.now()); // Use a key to force re-render if needed

  // Handle map ready event with error handling
  const handleMapReady = (map: any) => {
    try {
      if (!mapInstanceRef.current) {
        console.log("AccidentMap: Map instance stored");
        mapInstanceRef.current = map;
      }
      
      // Ensure the map is properly sized
      setTimeout(() => {
        if (map && typeof map.invalidateSize === 'function') {
          map.invalidateSize();
          console.log("AccidentMap: Map size invalidated");
        }
      }, 300);
    } catch (error) {
      console.error("Error in AccidentMap handleMapReady:", error);
    }
  };
  
  // Reset map instance on unmount
  useEffect(() => {
    return () => {
      console.log("AccidentMap: Component unmounting, cleaning up");
      mapInstanceRef.current = null;
    };
  }, []);
  
  // Force map to redraw if lat/lng changes significantly
  useEffect(() => {
    const forceRefresh = () => setMapKey(Date.now());
    
    if (mapInstanceRef.current && typeof mapInstanceRef.current.invalidateSize === 'function') {
      mapInstanceRef.current.invalidateSize();
      console.log("AccidentMap: Invalidating size due to lat/lng change");
    }
    
    // If the map was already created but lat/lng changed significantly,
    // we need to force a complete re-render
    if (mapInstanceRef.current && mapKey) {
      const currentCenter = mapInstanceRef.current.getCenter();
      const newLatLng = [lat, lng];
      
      const distance = mapInstanceRef.current.distance(
        currentCenter,
        newLatLng
      );
      
      // If the distance is more than 500 meters, force a re-render
      if (distance > 500) {
        console.log("AccidentMap: Significant location change, forcing re-render");
        forceRefresh();
      }
    }
  }, [lat, lng, mapKey]);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        key={mapKey}
        center={[lat, lng] as [number, number]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '100%' }}
        className="z-0"
        // IMPORTANT: Disable controls to minimize cleanup issues
        zoomControl={false}
        attributionControl={false}
        doubleClickZoom={false}
        dragging={true}
        touchZoom={true}
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
