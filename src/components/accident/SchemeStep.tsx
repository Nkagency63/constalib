
import { useIsMobile } from '../../hooks/use-mobile';
import AccidentMap from './AccidentMap';
import InteractiveScheme from './InteractiveScheme';
import { FormData, SchemeData } from './types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

interface SchemeStepProps {
  formData: FormData;
}

const SchemeStep = ({ formData }: SchemeStepProps) => {
  const isMobile = useIsMobile();
  const { lat, lng, address } = formData.geolocation;
  const [activeTab, setActiveTab] = useState<string>("scheme");
  
  const handleSaveScheme = (schemeData: SchemeData) => {
    // In a real app, we would save this data to formData
    console.log("Scheme data saved:", schemeData);
    toast.success("Schéma sauvegardé avec succès");
  };

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

      {lat && lng ? (
        <div className="space-y-6">
          <Tabs defaultValue="scheme" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="scheme">Schéma interactif</TabsTrigger>
              <TabsTrigger value="location">Localisation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scheme" className="mt-4">
              <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Utilisez les outils pour ajouter des véhicules, des annotations et des trajectoires. 
                  Sélectionnez un élément pour le modifier ou le supprimer.
                </AlertDescription>
              </Alert>
              
              <InteractiveScheme 
                formData={formData}
                onUpdateSchemeData={handleSaveScheme}
              />
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setActiveTab("location")}>
                  Voir la localisation
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="mt-4">
              <div className="mb-6">
                <h4 className="text-md font-medium text-constalib-dark mb-2">Localisation de l'accident</h4>
                <AccidentMap lat={lat} lng={lng} address={address} />
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setActiveTab("scheme")}>
                  Retour au schéma
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            La localisation de l'accident n'a pas été renseignée. Vous pouvez retourner à l'étape "Localisation" pour définir l'emplacement exact.
          </p>
        </div>
      )}
    </div>
  );
};

export default SchemeStep;
