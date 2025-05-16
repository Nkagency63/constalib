
import { useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { Vehicle } from '@/components/accident/types';

interface UseSchemeMapProps {
  readOnly: boolean;
  handleMapClick: (e: L.LeafletMouseEvent) => void;
  onReady: (map: L.Map) => void;
}

export const useSchemeMap = ({ readOnly, handleMapClick, onReady }: UseSchemeMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  const mapReadyCalledRef = useRef<boolean>(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const handleMapReady = useCallback((map: L.Map) => {
    if (mapReadyCalledRef.current) return;
    mapReadyCalledRef.current = true;
    
    console.log("Map initialization started");
    mapRef.current = map;
    
    // Configurer les gestionnaires d'événements si ce n'est pas en lecture seule
    if (!readOnly && mapRef.current) {
      try {
        // S'assurer que la carte est valide avant d'attacher des gestionnaires d'événements
        if (map && typeof map.off === 'function') {
          // Retirer d'abord tous les gestionnaires de clics précédents
          map.off('click');
        }
        
        // Puis ajouter en toute sécurité notre nouveau gestionnaire de clics
        if (map && typeof map.on === 'function') {
          map.on('click', handleMapClick);
          console.log("Map click handler registered");
        }
      } catch (err) {
        console.error("Error setting up map click handlers:", err);
      }
    }
    
    // S'assurer que la carte est correctement dimensionnée
    try {
      setTimeout(() => {
        if (mapRef.current && typeof mapRef.current.invalidateSize === 'function') {
          mapRef.current.invalidateSize();
          console.log("Map size invalidated");
          
          // Marquer la carte comme initialisée
          setIsMapInitialized(true);
        }
      }, 300);
    } catch (err) {
      console.error("Error invalidating map size:", err);
    }
    
    // Appeler le callback onReady
    if (typeof onReady === 'function') {
      onReady(map);
      console.log("Map initialization completed");
    }
  }, [readOnly, handleMapClick, onReady]);

  const centerOnVehicles = useCallback((vehicles: Vehicle[]) => {
    if (!mapRef.current || !vehicles.length) return;
    
    console.log("Centering on vehicles:", vehicles.length);
    
    try {
      // Créer un objet bounds pour contenir toutes les positions des véhicules
      const validVehicles = vehicles.filter(v => 
        v.position && Array.isArray(v.position) && v.position.length === 2
      );
      
      if (!validVehicles.length) {
        toast("Pas de véhicules à centrer sur la carte. Ajoutez des véhicules pour utiliser cette fonction");
        return;
      }
      
      // Créer un objet bounds à partir de toutes les positions des véhicules
      const bounds = L.latLngBounds(
        validVehicles.map(v => L.latLng(v.position))
      );
      
      if (bounds.isValid() && mapRef.current && typeof mapRef.current.fitBounds === 'function') {
        // Ajouter un peu de marge aux limites
        bounds.pad(0.2);
        
        // Ajuster la carte aux limites avec animation
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 18,
          animate: true,
          duration: 0.5
        });
        
        toast(`Carte centrée sur les ${validVehicles.length} véhicule(s) visible(s)`);
        
        console.log("Map centered on vehicles successfully");
      }
    } catch (error) {
      console.error("Error centering on vehicles:", error);
      toast("Erreur lors du centrage de la carte");
    }
  }, []);

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles,
    isMapInitialized
  };
};
