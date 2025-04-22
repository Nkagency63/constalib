
import React, { Suspense, lazy } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

// Utiliser le chargement différé pour le composant de carte
const AccidentLocationMap = lazy(() => import('./scheme/AccidentLocationMap'));

interface SchemeStepProps {
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
}

const SchemeStep = ({ geolocation = { lat: null, lng: null, address: '' } }: SchemeStepProps) => {
  const isMobile = useIsMobile();
  const { lat, lng, address } = geolocation;
  
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
        <div className="w-full h-[500px] rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full bg-gray-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400">Chargement de la carte...</div>
          </div>
        </div>
      }>
        <AccidentLocationMap lat={lat} lng={lng} address={address} />
      </Suspense>
    </div>
  );
};

export default SchemeStep;
