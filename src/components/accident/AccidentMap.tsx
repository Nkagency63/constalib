
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  lat: number | null;
  lng: number | null;
  address: string;
}

const AccidentMap = ({ lat, lng, address }: AccidentMapProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const { toast } = useToast();

  // Debugging console logs
  console.log('AccidentMap Props:', { lat, lng, address });

  useEffect(() => {
    if (!lat || !lng) {
      console.warn('Latitude or Longitude is missing');
      toast({
        title: "Erreur de localisation",
        description: "Les coordonnées GPS sont manquantes.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (!window.L) {
      console.error('Leaflet not loaded');
      return;
    }

    // Initialize map only if it hasn't been initialized yet
    if (!mapInitialized) {
      // Set timeout to allow the DOM to render
      const timer = setTimeout(() => {
        try {
          console.log('Initializing map with position:', [lat, lng]);
          const mapContainer = document.getElementById('accident-map');
          
          if (!mapContainer) {
            console.error('Map container not found');
            return;
          }
          
          // Create map
          const map = L.map(mapContainer).setView([lat, lng], 15);
          
          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add marker
          const marker = L.marker([lat, lng], { icon: accidentIcon }).addTo(map);
          marker.bindPopup(address).openPopup();
          
          setMapInitialized(true);
          console.log('Map initialized successfully');
        } catch (error) {
          console.error('Error initializing map:', error);
          toast({
            title: "Erreur de carte",
            description: "Impossible d'initialiser la carte.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }, 500);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [lat, lng, toast, mapInitialized]);

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100 animate-pulse" style={{ height: '300px' }}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-gray-400">Chargement de la carte...</div>
        </div>
      </div>
    );
  }

  if (!lat || !lng) {
    return (
      <div className="rounded-lg overflow-hidden shadow-lg bg-red-50 border border-red-200" style={{ height: '300px' }}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-red-500">Coordonnées GPS manquantes</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div id="accident-map" style={{ height: '300px', width: '100%' }}></div>
    </div>
  );
};

export default AccidentMap;
