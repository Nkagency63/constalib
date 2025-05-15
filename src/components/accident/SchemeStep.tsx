
import React, { useState } from 'react';
import { FormData, SchemeData } from './types';
import SchemeContainer from './scheme/SchemeContainer';
import { toast } from '@/hooks/use-toast';

interface SchemeStepProps {
  formData: FormData;
  onSchemeUpdate?: (schemeData: SchemeData) => void;
}

const SchemeStep: React.FC<SchemeStepProps> = ({ formData, onSchemeUpdate }) => {
  const [hasShownUpdateToast, setHasShownUpdateToast] = useState(false);
  
  const handleSchemeUpdate = (schemeData: SchemeData) => {
    console.log('Scheme data saved:', schemeData);
    
    // Show toast only on first meaningful update
    if (!hasShownUpdateToast && (
      schemeData.vehicles.length > 0 || 
      schemeData.paths.length > 0 || 
      schemeData.annotations.length > 0
    )) {
      toast("Schéma mis à jour", {
        description: "Les modifications sont enregistrées automatiquement"
      });
      setHasShownUpdateToast(true);
    }
    
    // If a handler was provided, call it with the updated scheme data
    if (onSchemeUpdate) {
      onSchemeUpdate(schemeData);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-constalib-dark-gray mb-4">
          Positionnez les véhicules et tracez les trajectoires pour illustrer l'accident. 
          Vous pouvez ajouter jusqu'à 4 véhicules différents.
        </p>
        
        <div className="h-[500px] rounded-lg overflow-hidden">
          <SchemeContainer
            formData={formData}
            onSchemeUpdate={handleSchemeUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default SchemeStep;
