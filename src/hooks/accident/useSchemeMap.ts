
import { useRef, useCallback } from 'react';
import L from 'leaflet';
import { toast } from '@/hooks/use-toast';
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

  const handleMapReady = useCallback((map: L.Map) => {
    if (mapReadyCalledRef.current) return;
    mapReadyCalledRef.current = true;
    
    console.log("Map initialization started");
    mapRef.current = map;
    
    // Configure event handlers if not readonly
    if (!readOnly && mapRef.current) {
      // Make sure to remove any previous click handlers first
      mapRef.current.off('click');
      // Then add our new click handler
      mapRef.current.on('click', handleMapClick);
      console.log("Map click handler registered");
    }
    
    // Ensure map is properly sized
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        console.log("Map size invalidated");
      }
    }, 300);
    
    // Call the onReady callback to initialize the map with the map object
    onReady(map);
    console.log("Map initialization completed");
  }, [readOnly, handleMapClick, onReady]);

  const centerOnVehicles = useCallback((vehicles: Vehicle[]) => {
    if (!mapRef.current || vehicles.length === 0) return;
    
    console.log("Centering on vehicles:", vehicles.length);
    
    try {
      // Create a bounds object to contain all vehicle positions
      const validVehicles = vehicles.filter(v => 
        v.position && Array.isArray(v.position) && v.position.length === 2
      );
      
      if (validVehicles.length === 0) {
        toast({
          description: "Pas de véhicules à centrer sur la carte. Ajoutez des véhicules pour utiliser cette fonction"
        });
        return;
      }
      
      // Create a bounds object from all vehicle positions
      const bounds = L.latLngBounds(
        validVehicles.map(v => L.latLng(v.position))
      );
      
      if (bounds.isValid()) {
        // Add some padding to the bounds
        bounds.pad(0.2);
        
        // Fit the map to the bounds with animation
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 18,
          animate: true,
          duration: 0.5
        });
        
        toast({
          description: `Carte centrée sur les ${validVehicles.length} véhicule(s) visible(s)`
        });
        
        console.log("Map centered on vehicles successfully");
      }
    } catch (error) {
      console.error("Error centering on vehicles:", error);
      toast({
        description: "Erreur lors du centrage de la carte"
      });
    }
  }, []);

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles
  };
};
