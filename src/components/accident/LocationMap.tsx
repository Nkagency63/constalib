
import { useEffect, useRef } from 'react';
import { Map, NavigationControl, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Car } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Utiliser une clé d'API publique de Mapbox (limité en usage)
// Dans un environnement de production, cette clé devrait être stockée dans les variables d'environnement
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29uc3RhbGliLWFwcCIsImEiOiJjbHdwZWE0cmUwMDg5MmpwZGF4Y3l0cWg3In0.X2D7XsWZEBEQrzX2r1N9Rg';

interface LocationMapProps {
  lat: number | null;
  lng: number | null;
  address: string;
}

const LocationMap = ({ lat, lng, address }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !lat || !lng) return;

    // Vérifier si la carte est déjà initialisée
    if (map.current) return;

    // Initialiser la carte
    (window as any).mapboxgl = { accessToken: MAPBOX_TOKEN };
    map.current = new Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 15,
      attributionControl: false
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new NavigationControl(), 'top-right');

    // Ajouter un marqueur pour l'emplacement de l'accident
    marker.current = new Marker({ color: '#ff4757' })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Nettoyer la carte lorsque le composant est démonté
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lat, lng]);

  // Mettre à jour la position du marqueur lorsque lat/lng changent
  useEffect(() => {
    if (!map.current || !marker.current || !lat || !lng) return;
    marker.current.setLngLat([lng, lat]);
    map.current.flyTo({ center: [lng, lat], zoom: 15 });
  }, [lat, lng]);

  // Si nous n'avons pas de coordonnées, afficher un message
  if (!lat || !lng) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800 text-sm">
          Veuillez d'abord définir l'emplacement de l'accident dans l'onglet "Localisation".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-[250px] rounded-lg overflow-hidden shadow-sm border border-gray-200" ref={mapContainer} />
      <p className="text-xs text-constalib-dark-gray">{address}</p>
    </div>
  );
};

export default LocationMap;
