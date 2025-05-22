
import { useState } from 'react';
import { FormData } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CarTaxiFront, User, Users, FileText } from 'lucide-react';

interface OwnerDriverStepProps {
  formData: FormData;
  handleOwnerDriverChange: (e: React.ChangeEvent<HTMLInputElement>, isOtherVehicle?: boolean) => void;
}

const OwnerDriverStep = ({
  formData,
  handleOwnerDriverChange
}: OwnerDriverStepProps) => {
  const [activeTab, setActiveTab] = useState("vehicle-a");

  const handleVehicleAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOwnerDriverChange(e, false);
  };

  const handleVehicleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOwnerDriverChange(e, true);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="vehicle-a" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Véhicule A (Vous)
          </TabsTrigger>
          <TabsTrigger value="vehicle-b" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Véhicule B (Autre)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicle-a" className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-constalib-blue" />
                <h3 className="text-lg font-medium">Propriétaire du véhicule</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Nom</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleVehicleAChange}
                    placeholder="Nom du propriétaire"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerFirstName">Prénom</Label>
                  <Input
                    id="ownerFirstName"
                    name="ownerFirstName"
                    value={formData.ownerFirstName}
                    onChange={handleVehicleAChange}
                    placeholder="Prénom du propriétaire"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerAddress">Adresse complète</Label>
                <Input
                  id="ownerAddress"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleVehicleAChange}
                  placeholder="Adresse du propriétaire"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center mb-2">
                <CarTaxiFront className="h-5 w-5 mr-2 text-constalib-blue" />
                <h3 className="text-lg font-medium">Conducteur</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Nom</Label>
                  <Input
                    id="driverName"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleVehicleAChange}
                    placeholder="Nom du conducteur"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driverFirstName">Prénom</Label>
                  <Input
                    id="driverFirstName"
                    name="driverFirstName"
                    value={formData.driverFirstName}
                    onChange={handleVehicleAChange}
                    placeholder="Prénom du conducteur"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driverLicenseNumber">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-constalib-dark-gray" />
                    Numéro de permis de conduire
                  </div>
                </Label>
                <Input
                  id="driverLicenseNumber"
                  name="driverLicenseNumber"
                  value={formData.driverLicenseNumber}
                  onChange={handleVehicleAChange}
                  placeholder="Numéro du permis"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverLicenseDate">Date d'obtention</Label>
                  <Input
                    id="driverLicenseDate"
                    name="driverLicenseDate"
                    type="date"
                    value={formData.driverLicenseDate}
                    onChange={handleVehicleAChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driverLicenseCountry">Pays de délivrance</Label>
                  <Input
                    id="driverLicenseCountry"
                    name="driverLicenseCountry"
                    value={formData.driverLicenseCountry}
                    onChange={handleVehicleAChange}
                    placeholder="Pays de délivrance"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicle-b" className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-constalib-blue" />
                <h3 className="text-lg font-medium">Propriétaire du véhicule</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otherOwnerName">Nom</Label>
                  <Input
                    id="otherOwnerName"
                    name="ownerName"
                    value={formData.otherVehicle.ownerName}
                    onChange={handleVehicleBChange}
                    placeholder="Nom du propriétaire"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherOwnerFirstName">Prénom</Label>
                  <Input
                    id="otherOwnerFirstName"
                    name="ownerFirstName"
                    value={formData.otherVehicle.ownerFirstName}
                    onChange={handleVehicleBChange}
                    placeholder="Prénom du propriétaire"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherOwnerAddress">Adresse complète</Label>
                <Input
                  id="otherOwnerAddress"
                  name="ownerAddress"
                  value={formData.otherVehicle.ownerAddress}
                  onChange={handleVehicleBChange}
                  placeholder="Adresse du propriétaire"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center mb-2">
                <CarTaxiFront className="h-5 w-5 mr-2 text-constalib-blue" />
                <h3 className="text-lg font-medium">Conducteur</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otherDriverName">Nom</Label>
                  <Input
                    id="otherDriverName"
                    name="driverName"
                    value={formData.otherVehicle.driverName}
                    onChange={handleVehicleBChange}
                    placeholder="Nom du conducteur"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherDriverFirstName">Prénom</Label>
                  <Input
                    id="otherDriverFirstName"
                    name="driverFirstName"
                    value={formData.otherVehicle.driverFirstName}
                    onChange={handleVehicleBChange}
                    placeholder="Prénom du conducteur"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherDriverLicenseNumber">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-constalib-dark-gray" />
                    Numéro de permis de conduire
                  </div>
                </Label>
                <Input
                  id="otherDriverLicenseNumber"
                  name="driverLicenseNumber"
                  value={formData.otherVehicle.driverLicenseNumber}
                  onChange={handleVehicleBChange}
                  placeholder="Numéro du permis"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otherDriverLicenseDate">Date d'obtention</Label>
                  <Input
                    id="otherDriverLicenseDate"
                    name="driverLicenseDate"
                    type="date"
                    value={formData.otherVehicle.driverLicenseDate}
                    onChange={handleVehicleBChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherDriverLicenseCountry">Pays de délivrance</Label>
                  <Input
                    id="otherDriverLicenseCountry"
                    name="driverLicenseCountry"
                    value={formData.otherVehicle.driverLicenseCountry}
                    onChange={handleVehicleBChange}
                    placeholder="Pays de délivrance"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerDriverStep;
