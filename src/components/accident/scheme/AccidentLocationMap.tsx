import React, { useEffect, useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useVehicleScheme } from './useVehicleScheme';
import VehicleIcon from './VehicleIcon';
import { Car, Plus, Minus, Undo, Redo, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
  const [mapError, setMapError] = useState<string | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);
  
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

  const initializeMap = useCallback(() => {
    if (!mapRef.current) {
      console.error('Map container reference not found');
      setMapError('Conteneur de carte introuvable');
      setIsLoading(false);
      return;
    }
    
    try {
      setMapError(null);
      
      if (map) {
        map.off();
        map.remove();
      }
      
      const useLocation = {
        lat: lat || DEFAULT_LOCATION.lat,
        lng: lng || DEFAULT_LOCATION.lng
      };
      
      console.log('Initializing map at coordinates:', useLocation);
      console.log('Map container element ID:', mapRef.current.id);
      console.log('Map container dimensions:', mapRef.current.clientWidth, 'x', mapRef.current.clientHeight);
      
      const newMap = L.map(mapRef.current, {
        preferCanvas: true,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: false,
        inertia: false,
        markerZoomAnimation: false
      }).setView([useLocation.lat, useLocation.lng], 18);
      
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 15,
      }).addTo(newMap);

      if (lat && lng) {
        L.marker([lat, lng]).addTo(newMap);
      }
      
      newMap.on('click', handleMapClick);
      
      setMap(newMap);
      setIsLoading(false);
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Erreur d\'initialisation de la carte');
      setIsLoading(false);
      
      if (mapRef.current) {
        console.log('Map container state when error occurred:', {
          id: mapRef.current.id,
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight,
          innerHTML: mapRef.current.innerHTML.substring(0, 100) + '...',
          isConnected: mapRef.current.isConnected
        });
      }
      
      toast('Erreur de carte', {
        description: 'Impossible d\'initialiser la carte. Veuillez réessayer.',
      });
    }
  }, [lat, lng, map]);

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (!map) return;
    const point = map.mouseEventToContainerPoint(e.originalEvent);
    if (isDragging && selectedVehicle) {
      updateVehiclePosition(selectedVehicle, point.x, point.y);
    }
  }, [map, isDragging, selectedVehicle, updateVehiclePosition]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        initializeMap();
        setInitAttempts(prev => prev + 1);
      } else {
        console.error('Map container element not available after timeout');
        setMapError('Conteneur de carte non disponible');
        setIsLoading(false);
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (map) {
        map.off('click', handleMapClick);
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (initAttempts > 0) {
      console.log('Coordinates changed, reinitializing map:', { lat, lng });
      
      const timer = setTimeout(() => {
        if (mapRef.current) {
          setIsLoading(true);
          initializeMap();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [lat, lng, initAttempts, initializeMap]);

  const handleVehicleMouseDown = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedVehicle(vehicleId);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setMapError(null);
    
    setTimeout(() => {
      if (mapRef.current) {
        initializeMap();
      } else {
        setMapError('Conteneur de carte non disponible');
        setIsLoading(false);
      }
    }, 300);
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
        ) : mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-4">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-red-600 mb-4">{mapError}</p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <div 
              ref={mapRef}
              id="accident-location-map" 
              className="absolute inset-0 z-0"
              style={{ height: '100%' }}
              onMouseUp={handleMouseUp}
            />
            
            {vehicles.map(vehicle => (
              <VehicleIcon
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={selectedVehicle === vehicle.id}
                onMouseDown={handleVehicleMouseDown}
                onRotate={rotateVehicle}
                onRemove={removeVehicle}
              />
            ))}
          </>
        )}
        
        {!isLoading && !mapError && !lat && !lng && (
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
