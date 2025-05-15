import React from 'react';
import { VehicleData } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Car, Truck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MultiVehicleStepProps {
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  firstRegistration?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
  otherVehicle: VehicleData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOtherVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setOtherVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  onEmergencyContacted: () => void;
  vehicleId: 'A' | 'B';
  setVehicleId: (vehicleId: 'A' | 'B') => void;
  emergencyContacted: boolean;
}

const MultiVehicleStep: React.FC<MultiVehicleStepProps> = ({
  licensePlate,
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  vehicleDescription,
  firstRegistration,
  insurancePolicy,
  insuranceCompany,
  otherVehicle,
  handleInputChange,
  handleOtherVehicleChange,
  setVehicleInfo,
  setOtherVehicleInfo,
  onEmergencyContacted,
  vehicleId,
  setVehicleId,
  emergencyContacted
}) => {
  const handleVehicleLookup = (plate: string, isOtherVehicle: boolean) => {
    // Simulation d'une recherche de véhicule
    if (plate.length >= 5) {
      setTimeout(() => {
        if (isOtherVehicle) {
          setOtherVehicleInfo({
            brand: 'Peugeot',
            model: '308',
            year: '2019',
            firstRegistration: '2019-05-15'
          });
        } else {
          setVehicleInfo({
            brand: 'Renault',
            model: 'Clio',
            year: '2020',
            firstRegistration: '2020-03-10'
          });
        }
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {!emergencyContacted && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            En cas de blessés, contactez immédiatement les services d'urgence.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-white" 
              onClick={onEmergencyContacted}
            >
              J'ai contacté les secours
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs 
        defaultValue={vehicleId} 
        onValueChange={(value) => setVehicleId(value as 'A' | 'B')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="A" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>Votre véhicule</span>
          </TabsTrigger>
          <TabsTrigger value="B" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Autre véhicule</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="A" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
            <div className="flex gap-2">
              <Input
                id="licensePlate"
                name="licensePlate"
                value={licensePlate}
                onChange={handleInputChange}
                placeholder="AB-123-CD"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => handleVehicleLookup(licensePlate, false)}
              >
                Rechercher
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleBrand">Marque</Label>
              <Input
                id="vehicleBrand"
                name="vehicleBrand"
                value={vehicleBrand}
                onChange={handleInputChange}
                placeholder="Renault, Peugeot, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Modèle</Label>
              <Input
                id="vehicleModel"
                name="vehicleModel"
                value={vehicleModel}
                onChange={handleInputChange}
                placeholder="Clio, 308, etc."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Année</Label>
              <Input
                id="vehicleYear"
                name="vehicleYear"
                value={vehicleYear}
                onChange={handleInputChange}
                placeholder="2020"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstRegistration">Première immatriculation</Label>
              <Input
                id="firstRegistration"
                name="firstRegistration"
                type="date"
                value={firstRegistration || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceCompany">Compagnie d'assurance</Label>
              <Input
                id="insuranceCompany"
                name="insuranceCompany"
                value={insuranceCompany || ''}
                onChange={handleInputChange}
                placeholder="Nom de l'assureur"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insurancePolicy">N° de police</Label>
              <Input
                id="insurancePolicy"
                name="insurancePolicy"
                value={insurancePolicy || ''}
                onChange={handleInputChange}
                placeholder="Numéro de contrat"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vehicleDescription">Description du véhicule</Label>
            <textarea
              id="vehicleDescription"
              name="vehicleDescription"
              value={vehicleDescription}
              onChange={handleInputChange}
              rows={3}
              placeholder="Couleur, particularités, etc."
              className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue resize-none"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="B" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="otherLicensePlate">Plaque d'immatriculation</Label>
            <div className="flex gap-2">
              <Input
                id="otherLicensePlate"
                name="licensePlate"
                value={otherVehicle.licensePlate}
                onChange={handleOtherVehicleChange}
                placeholder="AB-123-CD"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => handleVehicleLookup(otherVehicle.licensePlate, true)}
              >
                Rechercher
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="otherBrand">Marque</Label>
              <Input
                id="otherBrand"
                name="brand"
                value={otherVehicle.brand}
                onChange={handleOtherVehicleChange}
                placeholder="Renault, Peugeot, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherModel">Modèle</Label>
              <Input
                id="otherModel"
                name="model"
                value={otherVehicle.model}
                onChange={handleOtherVehicleChange}
                placeholder="Clio, 308, etc."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="otherYear">Année</Label>
              <Input
                id="otherYear"
                name="year"
                value={otherVehicle.year}
                onChange={handleOtherVehicleChange}
                placeholder="2020"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherFirstRegistration">Première immatriculation</Label>
              <Input
                id="otherFirstRegistration"
                name="firstRegistration"
                type="date"
                value={otherVehicle.firstRegistration || ''}
                onChange={handleOtherVehicleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="otherInsuranceCompany">Compagnie d'assurance</Label>
              <Input
                id="otherInsuranceCompany"
                name="insuranceCompany"
                value={otherVehicle.insuranceCompany || ''}
                onChange={handleOtherVehicleChange}
                placeholder="Nom de l'assureur"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherInsurancePolicy">N° de police</Label>
              <Input
                id="otherInsurancePolicy"
                name="insurancePolicy"
                value={otherVehicle.insurancePolicy || ''}
                onChange={handleOtherVehicleChange}
                placeholder="Numéro de contrat"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otherDescription">Description du véhicule</Label>
            <textarea
              id="otherDescription"
              name="description"
              value={otherVehicle.description}
              onChange={handleOtherVehicleChange}
              rows={3}
              placeholder="Couleur, particularités, etc."
              className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue resize-none"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-constalib-light-blue p-4 rounded-lg flex items-start space-x-3">
        <AlertCircle className="text-constalib-blue flex-shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-constalib-blue font-medium">Conseil</h4>
          <p className="text-sm text-constalib-dark-gray">
            Assurez-vous de noter correctement les informations des deux véhicules impliqués. 
            Ces informations sont essentielles pour le traitement de votre déclaration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiVehicleStep;
