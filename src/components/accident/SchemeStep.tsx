
import React from 'react';
import VehicleScheme from '../VehicleScheme';
import { useIsMobile } from '@/hooks/use-mobile';

const SchemeStep = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Positionnez les véhicules pour représenter visuellement l'accident.
          {isMobile && " Utilisez les boutons pour zoomer et faire pivoter les véhicules."}
        </p>
      </div>
      
      <VehicleScheme />
    </div>
  );
};

export default SchemeStep;
