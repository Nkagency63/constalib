
import { useRef } from 'react';
import VehicleScheme from '../VehicleScheme';
import LocationMap from './LocationMap';
import { FormData } from './types';
import { MapPin, Map as MapIcon, Car } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchemeStepProps {
  formData: FormData;
}

const SchemeStep = ({ formData }: SchemeStepProps) => {
  const { geolocation } = formData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Positionnez les véhicules pour représenter visuellement l'accident.
        </p>
      </div>
      
      <Tabs defaultValue="scheme" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scheme" className="flex items-center">
            <Car className="w-4 h-4 mr-2" />
            Positionnement
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Carte du lieu
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheme" className="pt-4">
          <VehicleScheme />
        </TabsContent>
        
        <TabsContent value="map" className="pt-4">
          <div className="space-y-4">
            <div className="p-4 bg-constalib-light-blue/10 rounded-lg">
              <div className="flex items-start">
                <MapIcon className="w-5 h-5 text-constalib-blue mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium text-constalib-dark">Localisation de l'accident</span><br />
                  <span className="text-constalib-dark-gray">
                    Voici la carte précise du lieu de l'accident. Elle vous permettra de mieux visualiser
                    la configuration des lieux et de positionner les véhicules de manière plus précise.
                  </span>
                </p>
              </div>
            </div>
            
            <LocationMap 
              lat={geolocation.lat} 
              lng={geolocation.lng} 
              address={geolocation.address} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemeStep;
