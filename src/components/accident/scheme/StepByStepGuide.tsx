
import React from 'react';
import { Check, Car, Route, StickyNote } from 'lucide-react';

interface StepByStepGuideProps {
  vehicleCount: number;
  pathCount: number;
  annotationCount: number;
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({ 
  vehicleCount, 
  pathCount, 
  annotationCount 
}) => {
  // Ne pas afficher le guide si tous les éléments sont présents
  if (vehicleCount > 0 && pathCount > 0 && annotationCount > 0) {
    return null;
  }
  
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 text-sm w-64">
      <h4 className="font-medium mb-2">Guide étape par étape</h4>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {vehicleCount > 0 ? (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <Car className="w-3 h-3 text-blue-600" />
            </div>
          )}
          <span className={vehicleCount > 0 ? "text-green-600" : ""}>
            {vehicleCount > 0 ? "Véhicules ajoutés" : "Ajoutez les véhicules impliqués"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {pathCount > 0 ? (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <Route className="w-3 h-3 text-gray-600" />
            </div>
          )}
          <span className={pathCount > 0 ? "text-green-600" : ""}>
            {pathCount > 0 ? "Trajectoires tracées" : "Tracez les trajectoires des véhicules"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {annotationCount > 0 ? (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <StickyNote className="w-3 h-3 text-gray-600" />
            </div>
          )}
          <span className={annotationCount > 0 ? "text-green-600" : ""}>
            {annotationCount > 0 ? "Annotations ajoutées" : "Ajoutez des annotations si nécessaire"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepByStepGuide;
