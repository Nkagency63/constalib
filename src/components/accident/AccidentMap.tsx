
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Vehicle {
  id: number;
  position: [number, number];
  type: 'A' | 'B';
}

interface AccidentMapProps {
  vehicles: Vehicle[];
  onVehiclePlaced: (type: 'A' | 'B', position: [number, number]) => void;
  selectedVehicle: 'A' | 'B' | null;
}

const vehicleIconA = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const vehicleIconB = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapEvents({ onMapClick, selectedVehicle }: { 
  onMapClick: (latlng: LatLng) => void;
  selectedVehicle: 'A' | 'B' | null;
}) {
  useMapEvents({
    click: (e) => {
      if (selectedVehicle) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

const AccidentMap = ({ vehicles, onVehiclePlaced, selectedVehicle }: AccidentMapProps) => {
  const handleMapClick = (latlng: LatLng) => {
    if (selectedVehicle) {
      onVehiclePlaced(selectedVehicle, [latlng.lat, latlng.lng]);
    }
  };

  return (
    <MapContainer
      center={[46.603354, 1.888334]} // Centre de la France
      zoom={6}
      className="h-[400px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={handleMapClick} selectedVehicle={selectedVehicle} />
      
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={vehicle.position}
          icon={vehicle.type === 'A' ? vehicleIconA : vehicleIconB}
        />
      ))}
    </MapContainer>
  );
};

export default AccidentMap;
