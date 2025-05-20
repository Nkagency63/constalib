
import { useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import { toast } from 'sonner';
import { Vehicle } from '../types';

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
    
    // Configure event handlers if not readonly
    if (!readOnly && mapRef.current) {
      try {
        // Remove any previous click handlers safely
        if (typeof mapRef.current.off === 'function') {
          mapRef.current.off('click');
        }
        
        // Add our new click handler safely
        if (typeof mapRef.current.on === 'function') {
          mapRef.current.on('click', handleMapClick);
          console.log("Map click handler registered");
        }
      } catch (err) {
        console.error("Error setting up map click handlers:", err);
      }
    }
    
    // Ensure map is properly sized
    try {
      // Force invalidation of map size after a delay
      const timer = setTimeout(() => {
        if (mapRef.current && typeof mapRef.current.invalidateSize === 'function') {
          mapRef.current.invalidateSize(true);
          console.log("Map size invalidated");
          
          // Mark map as initialized
          setIsMapInitialized(true);
        }
      }, 300);

      // Add window resize handler to revalidate map size
      const handleResize = () => {
        if (mapRef.current && typeof mapRef.current.invalidateSize === 'function') {
          console.log("Map size invalidated on window resize");
          mapRef.current.invalidateSize(true);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error("Error invalidating map size:", err);
    }
    
    // Call the onReady callback
    if (typeof onReady === 'function') {
      onReady(map);
      console.log("Map initialization completed");
    }
  }, [readOnly, handleMapClick, onReady]);

  const centerOnVehicles = useCallback((vehicles: Vehicle[]) => {
    if (!mapRef.current || !vehicles || !vehicles.length) return;
    
    console.log("Centering on vehicles:", vehicles.length);
    
    try {
      // Create a bounds object to contain all vehicle positions
      const validVehicles = vehicles.filter(v => 
        v && v.position && Array.isArray(v.position) && v.position.length === 2
      );
      
      if (!validVehicles.length) {
        toast("Pas de véhicules à centrer sur la carte. Ajoutez des véhicules pour utiliser cette fonction");
        return;
      }
      
      // Create bounds from vehicle positions
      const bounds = L.latLngBounds(
        validVehicles.map(v => L.latLng(v.position[0], v.position[1]))
      );
      
      if (bounds.isValid() && mapRef.current && typeof mapRef.current.fitBounds === 'function') {
        // Add padding to bounds
        bounds.pad(0.2);
        
        // Fit map to bounds with animation
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
