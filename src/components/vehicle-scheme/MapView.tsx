
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Vehicle } from './types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Map, NavigationControl } from 'lucide-react';

// Utiliser une clé d'API publique de Mapbox (limité en usage)
// Dans un environnement de production, cette clé devrait être stockée dans les variables d'environnement
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29uc3RhbGliLWFwcCIsImEiOiJjbHdwZWE0cmUwMDg5MmpwZGF4Y3l0cWg3In0.X2D7XsWZEBEQrzX2r1N9Rg';

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
}

const MapView = ({
  geolocation,
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  onVehicleMove,
  onVehicleRotate,
  onVehicleRemove
}: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: any }>({});
  
  const [defaultCenter] = useState({
    // Coordonnées par défaut (Paris) si aucune géolocalisation n'est fournie
    lat: 48.8566,
    lng: 2.3522
  });

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialiser la carte
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const center = geolocation?.lat && geolocation?.lng
      ? [geolocation.lng, geolocation.lat]
      : [defaultCenter.lng, defaultCenter.lat];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center as [number, number],
      zoom: 15,
      pitch: 0
    });
    
    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [geolocation, defaultCenter.lat, defaultCenter.lng]);
  
  // Mettre à jour ou créer les marqueurs des véhicules
  useEffect(() => {
    if (!map.current) return;
    
    // Supprimer les marqueurs qui n'existent plus
    Object.keys(markers.current).forEach(id => {
      if (!vehicles.find(v => v.id === id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });
    
    // Ajouter ou mettre à jour les marqueurs
    vehicles.forEach(vehicle => {
      const lat = vehicle.mapLat || (geolocation?.lat || defaultCenter.lat);
      const lng = vehicle.mapLng || (geolocation?.lng || defaultCenter.lng);
      
      if (!markers.current[vehicle.id]) {
        // Créer un élément HTML personnalisé pour le marqueur
        const el = document.createElement('div');
        el.className = 'vehicle-marker';
        el.style.backgroundColor = vehicle.color;
        el.style.width = '30px';
        el.style.height = '50px';
        el.style.borderRadius = '5px';
        el.style.cursor = 'pointer';
        el.style.transform = `rotate(${vehicle.rotation}deg)`;
        el.style.transformOrigin = 'center';
        el.style.border = selectedVehicle === vehicle.id ? '2px solid black' : '1px solid rgba(0,0,0,0.5)';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        
        // Ajouter le texte du véhicule
        const textEl = document.createElement('div');
        textEl.innerText = vehicle.label;
        textEl.style.color = 'white';
        textEl.style.textAlign = 'center';
        textEl.style.fontSize = '10px';
        textEl.style.padding = '2px';
        textEl.style.fontWeight = 'bold';
        textEl.style.textShadow = '0 0 2px black';
        el.appendChild(textEl);
        
        // Créer le marqueur
        const marker = new mapboxgl.Marker({
          element: el,
          draggable: true
        })
          .setLngLat([lng, lat])
          .addTo(map.current);
        
        // Événement de clic sur le marqueur
        el.addEventListener('click', () => {
          onVehicleSelect(vehicle.id);
        });
        
        // Événement de fin de déplacement du marqueur
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          onVehicleMove(vehicle.id, lngLat.lat, lngLat.lng);
        });
        
        markers.current[vehicle.id] = marker;
      } else {
        // Mettre à jour la position du marqueur
        markers.current[vehicle.id].setLngLat([lng, lat]);
        
        // Mettre à jour le style du marqueur
        const el = markers.current[vehicle.id].getElement();
        el.style.backgroundColor = vehicle.color;
        el.style.transform = `rotate(${vehicle.rotation}deg)`;
        el.style.border = selectedVehicle === vehicle.id ? '2px solid black' : '1px solid rgba(0,0,0,0.5)';
        
        // Mettre à jour le texte
        const textEl = el.querySelector('div');
        if (textEl) {
          textEl.innerText = vehicle.label;
        }
      }
    });
  }, [vehicles, selectedVehicle, geolocation, defaultCenter.lat, defaultCenter.lng, onVehicleSelect, onVehicleMove]);
  
  // Centrer la carte sur la géolocalisation lorsqu'elle change
  useEffect(() => {
    if (!map.current || !geolocation?.lat || !geolocation?.lng) return;
    
    map.current.flyTo({
      center: [geolocation.lng, geolocation.lat],
      zoom: 15,
      essential: true
    });
  }, [geolocation?.lat, geolocation?.lng]);
  
  // Si aucune géolocalisation n'est fournie, afficher un message
  if (!geolocation?.lat || !geolocation?.lng) {
    return (
      <div className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <Map className="h-4 w-4 text-amber-500 mr-2" />
          <AlertDescription className="text-amber-800 text-sm">
            Veuillez d'abord définir l'emplacement de l'accident dans l'onglet "Localisation".
          </AlertDescription>
        </Alert>
        
        <div className="h-[400px] rounded-lg overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center" ref={mapContainer}>
          <div className="text-center p-4">
            <Map className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Aucune localisation définie</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {selectedVehicle && (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVehicleRotate(selectedVehicle, -45)}
          >
            Rotation -45°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVehicleRotate(selectedVehicle, 45)}
          >
            Rotation +45°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVehicleRemove(selectedVehicle)}
            className="text-red-500"
          >
            Supprimer
          </Button>
        </div>
      )}
      
      <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300 bg-white" ref={mapContainer} />
      
      <p className="text-xs text-gray-500">{geolocation.address}</p>
    </div>
  );
};

export default MapView;
