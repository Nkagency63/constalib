
import React, { useEffect, useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useVehicleScheme } from './useVehicleScheme';
import VehicleIcon from './VehicleIcon';
import { Car, Plus, Minus, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AccidentLocationMapProps {
  lat: number | null;
  lng: number | null;
  address: string;
}

const DEFAULT_LOCATION = {
  lat: 48.8566, // Paris as default location
  lng: 2.3522
};

const AccidentLocationMap = ({ lat, lng, address }: AccidentLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitAttempted, setMapInitAttempted] = useState(false);
  const { toast } = useToast();
  
  const {
    vehicles,
    selectedVehicle,
    isDragging,
    zoom,
    historyIndex,
    history,
    setSelectedVehicle,
    setIsDragging,
    addVehicle,
    updateVehiclePosition,
    rotateVehicle,
    removeVehicle,
    undo,
    redo,
    setZoom
  } = useVehicleScheme();

  // Map initialization function
  const initializeMap = useCallback(() => {
    if (!mapRef.current) {
      console.error('Map container reference not found');
      return;
    }
    
    try {
      setMapInitAttempted(true);
      
      // Clean up any previous map instance
      if (map) {
        map.off('click', handleMapClick);
        map.remove();
      }
      
      // Determine coordinates to use
      const useLocation = {
        lat: lat || DEFAULT_LOCATION.lat,
        lng: lng || DEFAULT_LOCATION.lng
      };
      
      console.log('Initializing map at coordinates:', useLocation);
      console.log('Map container element:', mapRef.current);
      
      // Create map with optimized settings
      const newMap = L.map(mapRef.current, {
        preferCanvas: true,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: false,
      }).setView([useLocation.lat, useLocation.lng], 18);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 15,
      }).addTo(newMap);

      // Add marker for exact position if we have coordinates
      if (lat && lng) {
        L.marker([lat, lng]).addTo(newMap);
      }
      
      // Setup map click handler
      newMap.on('click', handleMapClick);
      
      setMap(newMap);
      setIsLoading(false);
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erreur de carte",
        description: "Impossible d'initialiser la carte. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [lat, lng, toast, map]);

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (!map) return;
    const point = map.mouseEventToContainerPoint(e.originalEvent);
    if (isDragging && selectedVehicle) {
      updateVehiclePosition(selectedVehicle, point.x, point.y);
    }
  }, [map, isDragging, selectedVehicle, updateVehiclePosition]);

  // Initialize map when component is fully mounted and ready
  useEffect(() => {
    // Use a delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (mapRef.current) {
        initializeMap();
      } else {
        console.error('Map container element not available after timeout');
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (map) {
        map.off('click', handleMapClick);
        map.remove();
      }
    };
  }, [initializeMap]);

  // Re-initialize map when coordinates change
  useEffect(() => {
    if (mapInitAttempted && (lat || lng)) {
      // Small delay to ensure DOM updates before re-initializing
      const timer = setTimeout(() => {
        if (mapRef.current) {
          initializeMap();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [lat, lng, mapInitAttempted, initializeMap]);

  const handleVehicleMouseDown = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedVehicle(vehicleId);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // If map failed to initialize, provide a retry button
  const handleRetry = () => {
    setIsLoading(true);
    setMapInitAttempted(false);
    setTimeout(initializeMap, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={addVehicle}>
          <Car className="w-4 h-4 mr-2" />
          Ajouter un véhicule
        </Button>
        
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={undo} 
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={redo} 
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}>
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}>
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative w-full h-[500px] border border-constalib-gray rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-gray-500 mb-2">Chargement de la carte...</div>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-constalib-blue"></div>
            </div>
          </div>
        ) : (
          <div 
            ref={mapRef}
            id="accident-location-map" 
            className="absolute inset-0 z-0"
            style={{ height: '100%' }}
            onMouseUp={handleMouseUp}
          />
        )}
        
        {/* Vehicle icons layer - absolute positioned above the map */}
        {!isLoading && vehicles.map(vehicle => (
          <VehicleIcon
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicle === vehicle.id}
            onMouseDown={handleVehicleMouseDown}
            onRotate={rotateVehicle}
            onRemove={removeVehicle}
          />
        ))}
        
        {/* Show retry button if coordinates are missing */}
        {!isLoading && !lat && !lng && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
            <div className="text-center p-4">
              <p className="text-constalib-dark-gray mb-2">Coordonnées GPS manquantes</p>
              <Button onClick={handleRetry}>
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-constalib-dark-gray">
        <p>Glissez les véhicules sur la carte pour les positionner. Utilisez les outils pour les faire pivoter ou les supprimer.</p>
      </div>
    </div>
  );
};

export default AccidentLocationMap;
