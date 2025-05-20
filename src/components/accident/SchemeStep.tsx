
import React, { useState, useEffect } from 'react';
import { FormData, SchemeData } from './types';
import InteractiveScheme from './InteractiveScheme';
import { toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Car, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchemeStepProps {
  formData: FormData;
  onSchemeUpdate?: (schemeData: SchemeData) => void;
}

const SchemeStep: React.FC<SchemeStepProps> = ({ formData, onSchemeUpdate }) => {
  const [hasShownUpdateToast, setHasShownUpdateToast] = useState(false);
  const [activeTab, setActiveTab] = useState("scheme");
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
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle>Schéma d'accident</AlertTitle>
          <AlertDescription className="text-sm text-blue-700">
            Positionnez les véhicules A et B sur la carte pour illustrer l'accident. 
            Vous pouvez les déplacer en glissant-déposant, et les faire pivoter avec les contrôles.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="scheme" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="scheme">Vue Schématique</TabsTrigger>
            <TabsTrigger value="map">Vue Carte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scheme" className="p-0 border-0">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3 text-sm text-constalib-dark-gray">
                <Car className="h-4 w-4 text-blue-600" />
                <span>Véhicule A (votre véhicule) - <span className="font-semibold">{formData.vehicleBrand} {formData.vehicleModel}</span></span>
              </div>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-constalib-dark-gray">
                <Car className="h-4 w-4 text-red-600" />
                <span>Véhicule B (autre partie) - <span className="font-semibold">{formData.otherVehicle?.brand} {formData.otherVehicle?.model}</span></span>
              </div>
              
              <div className="h-[500px] rounded-lg overflow-hidden relative border border-gray-200">
                <InteractiveScheme
                  formData={formData}
                  onUpdateSchemeData={handleSchemeUpdate}
                  initialData={schemeData}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="p-0 border-0">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Visualisez l'emplacement de l'accident sur la carte. Vous pouvez zoomer et vous déplacer pour mieux voir les détails.
              </p>
              
              {/* La carte sera rendue ici à l'intérieur du composant InteractiveScheme */}
              <div className="h-[500px] rounded-lg overflow-hidden relative border border-gray-200">
                <InteractiveScheme
                  formData={formData}
                  onUpdateSchemeData={handleSchemeUpdate}
                  initialData={schemeData}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default SchemeStep;
