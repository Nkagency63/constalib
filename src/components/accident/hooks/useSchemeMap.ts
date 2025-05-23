
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
    console.log("Map initialization started");
    mapRef.current = map;
    
    // Configurer les gestionnaires d'événements si non en lecture seule
    if (!readOnly && mapRef.current) {
      mapRef.current.on('click', handleMapClick);
      console.log("Map click handler registered");
    }
    
    // S'assurer que la carte est correctement dimensionnée
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        console.log("Map size invalidated");
      }
    }, 100);
    
    // Appeler le callback onReady pour initialiser la carte
    onReady();
    console.log("Map initialization completed");
  }, [readOnly, handleMapClick, onReady]);

  const centerOnVehicles = useCallback((vehicles: Vehicle[]) => {
    if (!mapRef.current || vehicles.length === 0) return;
    
    console.log("Centering on vehicles:", vehicles.length);
    
    try {
      // Créer un objet bounds pour contenir toutes les positions des véhicules
      const bounds = L.latLngBounds(vehicles.map(v => v.position));
      
      // Légèrement agrandir les limites pour une meilleure visibilité
      bounds.pad(0.2);
      
      // Ajuster la carte à ces limites avec animation
      mapRef.current.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 0.5,
        maxZoom: 18
      });
      
      // Forcer un rafraîchissement de la carte
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);
      
      console.log("Map centered on vehicles successfully");
    } catch (error) {
      console.error("Error centering on vehicles:", error);
    }
  }, []);

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles
  };
};
