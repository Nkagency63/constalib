import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleIdentificationStep from './VehicleIdentificationStep';
import { Car, CarTaxiFront } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { FormData } from './types';

interface MultiVehicleStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  onEmergencyContacted: () => void;
}

const MultiVehicleStep = ({
  formData,
  handleInputChange,
  handleOtherVehicleChange,
  setVehicleInfo,
  setOtherVehicleInfo,
  onEmergencyContacted
}: MultiVehicleStepProps) => {
  const [activeTab, setActiveTab] = useState("your-vehicle");

  // Create subsets of the form data for each vehicle tab
  const yourVehicleFormData = {
    ...formData,
  };

  const otherVehicleFormData = {
    ...formData,
    licensePlate: formData.otherVehicle.licensePlate,
    vehicleBrand: formData.otherVehicle.brand,
    vehicleModel: formData.otherVehicle.model,
    vehicleYear: formData.otherVehicle.year,
    vehicleDescription: formData.otherVehicle.description,
    insurancePolicy: formData.otherVehicle.insurancePolicy || '',
    insuranceCompany: formData.otherVehicle.insuranceCompany || '',
  };

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
            formData={yourVehicleFormData}
            handleInputChange={handleInputChange}
            handleOtherVehicleChange={handleOtherVehicleChange}
            setVehicleInfo={setVehicleInfo}
            setOtherVehicleInfo={setOtherVehicleInfo}
            onEmergencyContacted={onEmergencyContacted}
          />
        </TabsContent>
        
        <TabsContent value="other-vehicle" className="mt-0">
          <VehicleIdentificationStep
            formData={otherVehicleFormData}
            handleInputChange={handleOtherVehicleChange}
            handleOtherVehicleChange={handleInputChange}
            setVehicleInfo={setOtherVehicleInfo}
            setOtherVehicleInfo={setVehicleInfo}
            onEmergencyContacted={onEmergencyContacted}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiVehicleStep;
