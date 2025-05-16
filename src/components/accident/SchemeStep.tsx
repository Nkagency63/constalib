
import React, { useState, useEffect } from 'react';
import { FormData, SchemeData } from './types';
import InteractiveScheme from './InteractiveScheme';
import { toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

interface SchemeStepProps {
  formData: FormData;
  onSchemeUpdate?: (schemeData: SchemeData) => void;
}

const SchemeStep: React.FC<SchemeStepProps> = ({ formData, onSchemeUpdate }) => {
  const [hasShownUpdateToast, setHasShownUpdateToast] = useState(false);
  const [schemeData, setSchemeData] = useState<SchemeData>({
    vehicles: [],
    paths: [],
    annotations: [],
    center: formData?.geolocation?.lat && formData?.geolocation?.lng 
      ? [formData.geolocation.lat, formData.geolocation.lng] 
      : [48.8566, 2.3522],
    zoom: 17
  });
  
  // Initialize with existing scheme data if available in formData
  useEffect(() => {
    if (formData.schemeData) {
      setSchemeData(formData.schemeData);
    }
  }, [formData.schemeData]);

  const handleSchemeUpdate = (updatedSchemeData: SchemeData) => {
    console.log('Scheme data saved:', updatedSchemeData);
    setSchemeData(updatedSchemeData);
    
    // Show toast only on first meaningful update
    if (!hasShownUpdateToast && (
      updatedSchemeData.vehicles.length > 0 || 
      updatedSchemeData.paths.length > 0 || 
      updatedSchemeData.annotations.length > 0
    )) {
      toast("Les modifications sont enregistrées automatiquement");
      setHasShownUpdateToast(true);
    }
    
    // If a handler was provided, call it with the updated scheme data
    if (onSchemeUpdate) {
      onSchemeUpdate(updatedSchemeData);
    }
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-constalib-dark-gray mb-4">
            Positionnez les véhicules et tracez les trajectoires pour illustrer l'accident. 
            Vous pouvez ajouter jusqu'à 4 véhicules différents.
          </p>
          
          <div className="h-[500px] rounded-lg overflow-hidden">
            <InteractiveScheme
              formData={formData}
              onUpdateSchemeData={handleSchemeUpdate}
              initialData={schemeData}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SchemeStep;
