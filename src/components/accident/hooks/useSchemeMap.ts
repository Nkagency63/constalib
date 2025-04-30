
import { useRef, useCallback } from 'react';
import L from 'leaflet';
import { Vehicle } from '../types';

interface UseSchemeMapProps {
  readOnly: boolean;
  handleMapClick: (e: L.LeafletMouseEvent) => void;
  onReady: () => void;
}

export const useSchemeMap = ({ readOnly, handleMapClick, onReady }: UseSchemeMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
    
    // Ne pas essayer de supprimer les contrôles, car cela peut causer des erreurs
    // si les contrôles n'existent pas ou ne sont pas correctement initialisés
    
    // Configurer les gestionnaires d'événements si non en lecture seule
    if (!readOnly && mapRef.current) {
      mapRef.current.on('click', handleMapClick);
    }
    
    // Appeler le callback onReady pour initialiser la carte
    onReady();
  }, [readOnly, handleMapClick, onReady]);

  const centerOnVehicles = useCallback((vehicles: Vehicle[]) => {
    if (!mapRef.current || vehicles.length === 0) return;
    
    // Créer un objet bounds pour contenir toutes les positions des véhicules
    const bounds = L.latLngBounds(vehicles.map(v => v.position));
    
    // Légèrement agrandir les limites pour une meilleure visibilité
    bounds.pad(0.2);
    
    // Ajuster la carte à ces limites avec animation
    mapRef.current.flyToBounds(bounds, {
      padding: [50, 50],
      duration: 0.5
    });
  }, []);

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles
  };
};
