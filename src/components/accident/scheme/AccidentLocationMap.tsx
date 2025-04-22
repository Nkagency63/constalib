
import React, { useEffect, useState } from 'react';
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

const AccidentLocationMap = ({ lat, lng, address }: AccidentLocationMapProps) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (!lat || !lng || !document.getElementById('accident-location-map')) return;

    // Utiliser un timer pour éviter de bloquer le rendu
    const timeoutId = setTimeout(() => {
      try {
        // Options de performance pour Leaflet
        const newMap = L.map('accident-location-map', {
          preferCanvas: true, // Utiliser Canvas au lieu de SVG pour de meilleures performances
          zoomControl: false, // Désactiver les contrôles de zoom par défaut
          attributionControl: false, // Désactiver l'attribution par défaut
          fadeAnimation: false, // Désactiver les animations de fondu
          zoomAnimation: false, // Désactiver les animations de zoom
        }).setView([lat, lng], 18);
        
        // Utiliser un serveur de tuiles plus rapide
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          minZoom: 15,
        }).addTo(newMap);

        // Ajouter un marqueur pour la position exacte
        L.marker([lat, lng]).addTo(newMap);
        
        setMap(newMap);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
        toast({
          title: "Erreur de carte",
          description: "Impossible d'initialiser la carte.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }, 100); // Petit délai pour laisser le DOM se mettre à jour

    return () => {
      clearTimeout(timeoutId);
      if (map) map.remove();
    };
  }, [lat, lng, toast]);

  const handleVehicleMouseDown = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedVehicle(vehicleId);
    setIsDragging(true);
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!map) return;
    const point = map.mouseEventToContainerPoint(e.originalEvent);
    if (isDragging && selectedVehicle) {
      updateVehiclePosition(selectedVehicle, point.x, point.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!lat || !lng) {
    return (
      <div className="rounded-lg overflow-hidden shadow-lg bg-red-50 border border-red-200" style={{ height: '500px' }}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-red-500">Coordonnées GPS manquantes</div>
        </div>
      </div>
    );
  }

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
          <div className="w-full h-full">
            <Skeleton className="w-full h-full bg-gray-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400">Chargement de la carte...</div>
            </div>
          </div>
        ) : (
          <div 
            id="accident-location-map" 
            className="absolute inset-0"
            style={{ height: '100%' }}
            onMouseUp={handleMouseUp}
          >
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
