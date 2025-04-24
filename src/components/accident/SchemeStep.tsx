
import { useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import VehicleLeafletMap from '../VehicleLeafletMap';

const SchemeStep = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Positionnez les véhicules pour représenter visuellement l'accident.
        </p>
        {isMobile && (
          <p className="text-xs text-amber-600 mt-1">
            Tournez votre appareil en mode paysage pour une meilleure expérience.
          </p>
        )}
      </div>
      
      <VehicleLeafletMap />
    </div>
  );
};

export default SchemeStep;
