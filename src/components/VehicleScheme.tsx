import { useState, useEffect } from 'react';
import { SchemeData, VehicleSchemeData } from './accident/types/types';
import SchemeContainer from './accident/scheme/components/SchemeContainer';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';
import '../components/accident/scheme/scheme.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapResizer from './accident/MapResizer';

interface VehicleSchemeProps {
  initialData?: SchemeData | null;
  onSchemeUpdate?: (data: SchemeData) => void;
}

const VehicleScheme = ({ initialData, onSchemeUpdate }: VehicleSchemeProps) => {
  const [schemeData, setSchemeData] = useState<SchemeData>({
    vehicles: initialData?.vehicles || [
      {
        id: 'vehicle-a',
        type: 'A',
        position: [200, 150],
        x: 200,
        y: 150,
        rotation: 0,
        width: 80,
        height: 40,
        color: '#3b82f6',
        label: 'Véhicule A'
      },
      {
        id: 'vehicle-b',
        type: 'B',
        position: [300, 250],
        x: 300,
        y: 250,
        rotation: 45,
        width: 80,
        height: 40,
        color: '#ef4444',
        label: 'Véhicule B'
      }
    ],
    paths: initialData?.paths || [],
    annotations: initialData?.annotations || [],
    center: initialData?.center || [50, 50],
    zoom: initialData?.zoom || 1
  });

  // Use geolocation to update center coordinates and get address
  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Geolocation successful:", latitude, longitude);
          
          // Update map center with current position
          setSchemeData((prev) => ({
            ...prev,
            center: [latitude, longitude] as [number, number],
            zoom: 17 // Set a better zoom level for location viewing
          }));
          
          // Perform reverse geocoding with Nominatim
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'accept-language': 'fr' } }
            );
            
            if (response.ok) {
              const data = await response.json();
              const address = data.display_name;
              console.log("Reverse geocoding successful:", address);
              
              // If onSchemeUpdate is provided, we can send the geolocation data
              if (onSchemeUpdate) {
                const updatedScheme = {
                  ...schemeData,
                  center: [latitude, longitude] as [number, number],
                  zoom: 17,
                  // You might want to add address to your scheme data structure
                  // This is optional and depends on your application's needs
                };
                onSchemeUpdate(updatedScheme);
              }
              
              toast("Position géographique détectée: " + address);
            } else {
              console.error("Reverse geocoding failed:", response.statusText);
              toast("Position géographique détectée");
            }
          } catch (error) {
            console.error("Error during reverse geocoding:", error);
            toast("Position géographique détectée");
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          toast.error("Impossible d'obtenir votre position. Utilisation des coordonnées par défaut.");
          
          // Keep default coordinates if user denies permission or any other error
          if (!initialData?.center) {
            setSchemeData(prev => ({
              ...prev,
              center: [48.8566, 2.3522] as [number, number], // Paris coordinates as fallback
              zoom: 13
            }));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser");
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
    }
  }, [initialData?.center]);

  useEffect(() => {
    // Update scheme with initialData if provided and not already set
    if (initialData && 
        initialData.vehicles && 
        initialData.vehicles.length > 0 && 
        (!schemeData.vehicles || schemeData.vehicles.length === 0)) {
      console.log("Updating VehicleScheme with initialData", initialData);
      setSchemeData(initialData);
    }
  }, [initialData]);

  const handleVehicleMove = (id: string, x: number, y: number) => {
    const updatedVehicles = schemeData.vehicles.map(vehicle => {
      if (vehicle.id === id) {
        return { 
          ...vehicle, 
          x, 
          y, 
          position: [x, y] as [number, number]  // Update position for compatibility with map
        };
      }
      return vehicle;
    });
    
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
  };
  
  const handleVehicleRotate = (id: string, rotation: number) => {
    const updatedVehicles = schemeData.vehicles.map(vehicle => {
      if (vehicle.id === id) {
        return { ...vehicle, rotation };
      }
      return vehicle;
    });
    
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
  };
  
  const addVehicle = () => {
    if (schemeData.vehicles.length >= 4) {
      toast("Maximum de 4 véhicules atteint");
      return;
    }
    
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
    const newVehicle: VehicleSchemeData = {
      id: uuidv4(),
      type: `${String.fromCharCode(65 + schemeData.vehicles.length)}`, // A, B, C, D, etc.
      position: [200, 200], // Default position
      x: 200,
      y: 200,
      rotation: 0,
      width: 80,
      height: 40,
      color: colors[schemeData.vehicles.length % colors.length],
      label: `Véhicule ${String.fromCharCode(65 + schemeData.vehicles.length)}`
    };
    
    const updatedVehicles = [...schemeData.vehicles, newVehicle];
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
    
    toast(`Véhicule ${newVehicle.type} ajouté`);
  };
  
  const removeVehicle = (id: string) => {
    const vehicleToRemove = schemeData.vehicles.find(v => v.id === id);
    const updatedVehicles = schemeData.vehicles.filter(vehicle => vehicle.id !== id);
    const updatedScheme = { ...schemeData, vehicles: updatedVehicles };
    setSchemeData(updatedScheme);
    if (onSchemeUpdate) onSchemeUpdate(updatedScheme);
    
    if (vehicleToRemove) {
      toast(`Véhicule ${vehicleToRemove.type} supprimé`);
    }
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={schemeData.center as [number, number]}
        zoom={schemeData.zoom || 17}
        className="map-container"
        attributionControl={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapResizer />
        
        <SchemeContainer
          vehicles={schemeData.vehicles}
          onVehicleMove={handleVehicleMove}
          onVehicleRotate={handleVehicleRotate}
          onAddVehicle={addVehicle}
          onRemoveVehicle={removeVehicle}
          width={500}
          height={500}
        />
      </MapContainer>
    </div>
  );
};

export default VehicleScheme;
