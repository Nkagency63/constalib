
import React, { useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import AccidentMap from './AccidentMap';
import InteractiveScheme from './InteractiveScheme';
import { FormData, SchemeData } from './types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { handleExportImage } from './scheme/SchemeExport';

interface SchemeStepProps {
  formData: FormData;
}

const SchemeStep = ({ formData }: SchemeStepProps) => {
  const isMobile = useIsMobile();
  const { lat, lng, address } = formData.geolocation;
  const [activeTab, setActiveTab] = useState<string>("scheme");
  const [schemeData, setSchemeData] = useState<SchemeData | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  // Variable pour suivre si une sauvegarde a déjà été affichée
  const [hasShownSaveToast, setHasShownSaveToast] = useState(false);
  
  const handleSaveScheme = (data: SchemeData) => {
    setSchemeData(data);
    console.log("Scheme data saved:", data);
    
    // N'afficher le toast que lors de la première sauvegarde
    if (!hasShownSaveToast) {
      toast({
        title: "Schéma enregistré",
        description: "Les modifications sont sauvegardées automatiquement",
        variant: "default",
      });
      setHasShownSaveToast(true);
    }
  };

  const handleExportScheme = () => {
    const mapRef = document.querySelector('.leaflet-container');
    if (!mapRef) {
      toast({
        title: "Erreur",
        description: "Impossible de trouver la carte",
        variant: "destructive",
      });
      return;
    }

    // Use the html2canvas library to capture the map as an image
    toast({
      title: "Exportation",
      description: "Préparation de l'image en cours...",
      variant: "default",
    });
    
    // Find the map from the DOM - we'll use this as a fallback
    const mapElement = document.querySelector('.leaflet-container') as HTMLElement;
    if (mapElement) {
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(mapElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
        }).then(canvas => {
          const imageUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = imageUrl;
          downloadLink.download = 'schema-accident.png';
          downloadLink.click();
          
          toast({
            title: "Exportation réussie",
            description: "L'image du schéma a été téléchargée",
            variant: "default",
          });
        }).catch(err => {
          console.error("Error exporting image:", err);
          toast({
            title: "Erreur",
            description: "Impossible d'exporter l'image",
            variant: "destructive",
          });
        });
      });
    }
  };
  
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Créez une représentation visuelle de l'accident en suivant le guide étape par étape.
        </p>
        {isMobile && (
          <p className="text-xs text-amber-600 mt-1">
            Tournez votre appareil en mode paysage pour une meilleure expérience.
          </p>
        )}
      </div>

      {lat && lng ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleHelp}
              className="flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              {showHelp ? "Masquer l'aide" : "Afficher l'aide"}
            </Button>
          </div>
          
          {showHelp && (
            <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Comment créer votre schéma d'accident</AlertTitle>
              <AlertDescription className="text-blue-800 text-sm">
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>
                    <strong>Ajoutez les véhicules</strong> impliqués dans l'accident en cliquant sur l'icône de véhicule
                    dans la barre d'outils latérale, puis en cliquant sur la carte.
                  </li>
                  <li>
                    <strong>Positionnez précisément</strong> chaque véhicule en le faisant glisser à l'emplacement souhaité.
                    Utilisez les flèches du clavier pour faire pivoter un véhicule sélectionné.
                  </li>
                  <li>
                    <strong>Tracez les trajectoires</strong> en sélectionnant l'outil trajectoire, puis en cliquant pour
                    placer des points sur la carte. Sélectionnez d'abord un véhicule pour associer la trajectoire à ce véhicule.
                  </li>
                  <li>
                    <strong>Ajoutez des annotations</strong> pour indiquer des éléments importants comme des feux de
                    signalisation, des obstacles, ou tout autre détail pertinent.
                  </li>
                </ol>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="scheme" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="scheme">Schéma interactif</TabsTrigger>
              <TabsTrigger value="location">Localisation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scheme" className="mt-4">              
              <InteractiveScheme 
                formData={formData}
                onUpdateSchemeData={handleSaveScheme}
              />
              
              <div className="mt-4 flex flex-wrap justify-between gap-2">
                <Button variant="outline" onClick={handleExportScheme}>
                  Exporter en image
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("location")}>
                  Voir la localisation
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="mt-4">
              <div className="mb-6">
                <h4 className="text-md font-medium text-constalib-dark mb-2">Localisation de l'accident</h4>
                <AccidentMap lat={lat} lng={lng} address={address} />
                
                <div className="mt-4 text-sm">
                  <p className="font-medium">Coordonnées GPS:</p>
                  <p className="text-constalib-dark-gray">
                    Latitude: {lat.toFixed(6)}, Longitude: {lng.toFixed(6)}
                  </p>
                  <p className="font-medium mt-2">Adresse:</p>
                  <p className="text-constalib-dark-gray">{address || "Adresse non disponible"}</p>
                </div>
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
