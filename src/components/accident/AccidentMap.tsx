
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CarFront } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AccidentMapProps {
  lat: number;
  lng: number;
  address: string;
}

const AccidentMap = ({ lat, lng, address }: AccidentMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || !lat || !lng) return;

    const initializeMap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          throw new Error(error.message);
        }

        if (!data?.token) {
          throw new Error('No Mapbox token available');
        }

        mapboxgl.accessToken = data.token;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 15,
          pitch: 45
        });

        // Ajouter les contrôles de navigation
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Créer un marqueur personnalisé pour l'accident
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `<div class="bg-red-500 p-2 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 17H5L3 15V13H21V15L19 17Z" stroke="white" stroke-width="2"/>
            <path d="M6 13V7C6 5.89543 6.89543 5 8 5H16C17.1046 5 18 5.89543 18 7V13" stroke="white" stroke-width="2"/>
          </svg>
        </div>`;

        // Ajouter le marqueur à la carte
        marker.current = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<p>${address}</p>`))
          .addTo(map.current);

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger la carte. Veuillez réessayer plus tard.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [lat, lng, address, toast]);

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
      <div ref={mapContainer} style={{ height: '300px' }} />
      <style>
        {`
          .custom-marker {
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default AccidentMap;
