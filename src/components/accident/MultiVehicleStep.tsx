
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleIdentificationStep from './VehicleIdentificationStep';
import { Car, CarTaxiFront } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface MultiVehicleStepProps {
  // Premier véhicule (le vôtre)
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  // Second véhicule
  otherVehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    description: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
}

const MultiVehicleStep = ({
  licensePlate,
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  vehicleDescription,
  otherVehicle,
  handleInputChange,
  handleOtherVehicleChange,
  setVehicleInfo,
  setOtherVehicleInfo
}: MultiVehicleStepProps) => {
  const [activeTab, setActiveTab] = useState("your-vehicle");

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 text-sm">
          Veuillez saisir les informations pour les deux véhicules impliqués dans l'accident.
          Commencez par votre véhicule, puis saisissez les informations du véhicule adverse.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="your-vehicle" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            Votre véhicule
          </TabsTrigger>
          <TabsTrigger value="other-vehicle" className="flex items-center">
            <CarTaxiFront className="mr-2 h-4 w-4" />
            Véhicule adverse
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="your-vehicle" className="mt-0">
          <VehicleIdentificationStep
            licensePlate={licensePlate}
            vehicleBrand={vehicleBrand}
            vehicleModel={vehicleModel}
            vehicleYear={vehicleYear}
            vehicleDescription={vehicleDescription}
            handleInputChange={handleInputChange}
            setVehicleInfo={setVehicleInfo}
          />
        </TabsContent>
        
        <TabsContent value="other-vehicle" className="mt-0">
          <VehicleIdentificationStep
            licensePlate={otherVehicle.licensePlate}
            vehicleBrand={otherVehicle.brand}
            vehicleModel={otherVehicle.model}
            vehicleYear={otherVehicle.year}
            vehicleDescription={otherVehicle.description}
            handleInputChange={handleOtherVehicleChange}
            setVehicleInfo={setOtherVehicleInfo}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiVehicleStep;
