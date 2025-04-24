
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface AccidentMapProps {
  lat: number;
  lng: number;
  address: string;
}

const AccidentMap = ({ lat, lng, address }: AccidentMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !lat || !lng) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHQ4Z2pvNWcwMWR2MmptbDcyeHJsZ3JrIn0.a4QqHi5sxv_8i5H5qyKEHQ';
    
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

    return () => {
      map.current?.remove();
    };
  }, [lat, lng, address]);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} style={{ height: '300px' }} />
      <style jsx>{`
        .custom-marker {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AccidentMap;

