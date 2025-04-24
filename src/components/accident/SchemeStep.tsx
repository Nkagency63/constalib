
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

// Use lazy loading for the map component
const AccidentLocationMap = lazy(() => 
  import('./scheme/AccidentLocationMap').catch(error => {
    console.error('Failed to load AccidentLocationMap:', error);
    toast('Erreur de chargement de la carte', {
      description: 'Impossible de charger le composant de carte.'
    });
    return { default: () => <MapLoadError onRetry={() => window.location.reload()} /> };
  })
);

interface SchemeStepProps {
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
}

// Fallback component for map loading errors
const MapLoadError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[500px] bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-600 mb-4">Impossible de charger la carte</p>
    <Button onClick={onRetry} variant="outline" size="sm">
      <RefreshCcw className="w-4 h-4 mr-2" />
      Réessayer
    </Button>
  </div>
);

const SchemeStep = ({ geolocation = { lat: null, lng: null, address: '' } }: SchemeStepProps) => {
  const isMobile = useIsMobile();
  const { lat, lng, address } = geolocation;
  const [isRetrying, setIsRetrying] = useState(false);
  const [key, setKey] = useState(0); // Key to force re-render of the map component
  const [mapMounted, setMapMounted] = useState(false);
  
  // Set map as mounted after initial render
  useEffect(() => {
    setMapMounted(true);
    return () => setMapMounted(false);
  }, []);
  
  // Reset retry state when geolocation changes
  useEffect(() => {
    if (isRetrying) {
      setIsRetrying(false);
    }
  }, [lat, lng, isRetrying]);
  
  // Force re-render of map when location changes with a slight delay
  useEffect(() => {
    if (!mapMounted) return;
    
    const timer = setTimeout(() => {
      setKey(prevKey => prevKey + 1);
      console.log('SchemeStep: Updating map key to force re-render', key + 1);
    }, 300); // Small delay to allow DOM to settle
    
    return () => clearTimeout(timer);
  }, [lat, lng, mapMounted, key]);
  
  const handleRetry = () => {
    setIsRetrying(true);
    // Force re-render of the map component by changing its key
    setKey(prevKey => {
      console.log('SchemeStep: Manual retry, updating key', prevKey + 1);
      return prevKey + 1;
    });
    
    toast('Tentative de rechargement de la carte', {
      description: 'Rechargement en cours...'
    });
    
    // Reset retry state after a short delay
    setTimeout(() => setIsRetrying(false), 100);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Positionnez les véhicules directement sur la carte pour représenter visuellement l'accident.
        </p>
        {isMobile && (
          <p className="text-xs text-amber-600 mt-1">
            Tournez votre appareil en mode paysage pour une meilleure expérience.
          </p>
        )}
      </div>

      <Suspense fallback={
        <div className="w-full h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-gray-100 flex flex-col items-center justify-center">
          <Skeleton className="w-full h-full absolute" />
          <div className="z-10 flex flex-col items-center">
            <div className="text-gray-500 mb-2">Chargement de la carte...</div>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-constalib-blue"></div>
          </div>
        </div>
      }>
        {(!isRetrying && mapMounted) && (
          <div id="map-container-wrapper" className="relative w-full h-auto">
            <AccidentLocationMap 
              key={key} 
              lat={lat} 
              lng={lng} 
              address={address} 
            />
          </div>
        )}
      </Suspense>
      
      {!lat && !lng && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm">
          <p className="font-medium">Coordonnées GPS manquantes</p>
          <p className="mt-1">Vous n'avez pas encore fourni de localisation précise. Revenez à l'étape "Lieu de l'accident" pour définir l'emplacement.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 bg-white"
            onClick={handleRetry}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Réessayer avec les données actuelles
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemeStep;
