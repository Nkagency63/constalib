
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DriverInfo, InsuredInfo } from './types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, User, ShieldCheck, Car, CarTaxiFront } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface DriversInsuredStepProps {
  driverA: DriverInfo;
  driverB: DriverInfo;
  insuredA: InsuredInfo;
  insuredB: InsuredInfo;
  updateDriverA: (field: keyof DriverInfo, value: string) => void;
  updateDriverB: (field: keyof DriverInfo, value: string) => void;
  updateInsuredA: (field: keyof InsuredInfo, value: string | boolean) => void;
  updateInsuredB: (field: keyof InsuredInfo, value: string | boolean) => void;
}

const DriversInsuredStep = ({
  driverA,
  driverB,
  insuredA,
  insuredB,
  updateDriverA,
  updateDriverB,
  updateInsuredA,
  updateInsuredB
}: DriversInsuredStepProps) => {
  const [activeTab, setActiveTab] = useState("vehicleA");

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 text-sm">
          Veuillez saisir les informations des conducteurs et des assurés pour les deux véhicules impliqués dans l'accident.
          Ces informations sont essentielles pour le constat amiable et seront utilisées par les assureurs.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="vehicleA" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            Véhicule A (le vôtre)
          </TabsTrigger>
          <TabsTrigger value="vehicleB" className="flex items-center">
            <CarTaxiFront className="mr-2 h-4 w-4" />
            Véhicule B
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicleA" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-constalib-blue" />
                  Conducteur du véhicule A
                </CardTitle>
                <CardDescription>
                  Informations sur la personne qui conduisait le véhicule A au moment de l'accident
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverA-name">Nom et prénom</Label>
                    <Input
                      id="driverA-name"
                      value={driverA.fullName}
                      onChange={(e) => updateDriverA('fullName', e.target.value)}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverA-address">Adresse</Label>
                    <Input
                      id="driverA-address"
                      value={driverA.address}
                      onChange={(e) => updateDriverA('address', e.target.value)}
                      placeholder="123 rue des Lilas, 75001 Paris"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverA-license">N° de permis</Label>
                    <Input
                      id="driverA-license"
                      value={driverA.licenseNumber}
                      onChange={(e) => updateDriverA('licenseNumber', e.target.value)}
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverA-license-date">Date du permis</Label>
                    <Input
                      id="driverA-license-date"
                      type="date"
                      value={driverA.licenseDate}
                      onChange={(e) => updateDriverA('licenseDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverA-phone">Téléphone</Label>
                    <Input
                      id="driverA-phone"
                      value={driverA.phone}
                      onChange={(e) => updateDriverA('phone', e.target.value)}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverA-email">Email</Label>
                    <Input
                      id="driverA-email"
                      type="email"
                      value={driverA.email}
                      onChange={(e) => updateDriverA('email', e.target.value)}
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-constalib-blue" />
                  Assuré du véhicule A
                </CardTitle>
                <CardDescription>
                  Informations sur le titulaire de la police d'assurance du véhicule A
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 pb-4">
                  <Switch 
                    id="insuredA-is-driver" 
                    checked={insuredA.isDriver}
                    onCheckedChange={(checked) => updateInsuredA('isDriver', checked)}
                  />
                  <Label htmlFor="insuredA-is-driver">L'assuré est le conducteur</Label>
                </div>

                <Separator />

                <div className={`space-y-4 pt-4 ${insuredA.isDriver ? 'opacity-50' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuredA-name">Nom et prénom</Label>
                      <Input
                        id="insuredA-name"
                        value={insuredA.fullName}
                        onChange={(e) => updateInsuredA('fullName', e.target.value)}
                        placeholder="Jean Dupont"
                        disabled={insuredA.isDriver}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuredA-address">Adresse</Label>
                      <Input
                        id="insuredA-address"
                        value={insuredA.address}
                        onChange={(e) => updateInsuredA('address', e.target.value)}
                        placeholder="123 rue des Lilas, 75001 Paris"
                        disabled={insuredA.isDriver}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuredA-phone">Téléphone</Label>
                      <Input
                        id="insuredA-phone"
                        value={insuredA.phone}
                        onChange={(e) => updateInsuredA('phone', e.target.value)}
                        placeholder="06 12 34 56 78"
                        disabled={insuredA.isDriver}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuredA-email">Email</Label>
                      <Input
                        id="insuredA-email"
                        type="email"
                        value={insuredA.email}
                        onChange={(e) => updateInsuredA('email', e.target.value)}
                        placeholder="jean.dupont@email.com"
                        disabled={insuredA.isDriver}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuredA-policy">N° de police d'assurance</Label>
                    <Input
                      id="insuredA-policy"
                      value={insuredA.policyNumber}
                      onChange={(e) => updateInsuredA('policyNumber', e.target.value)}
                      placeholder="POL123456789"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="vehicleB" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-constalib-blue" />
                  Conducteur du véhicule B
                </CardTitle>
                <CardDescription>
                  Informations sur la personne qui conduisait le véhicule B au moment de l'accident
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverB-name">Nom et prénom</Label>
                    <Input
                      id="driverB-name"
                      value={driverB.fullName}
                      onChange={(e) => updateDriverB('fullName', e.target.value)}
                      placeholder="Pierre Martin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverB-address">Adresse</Label>
                    <Input
                      id="driverB-address"
                      value={driverB.address}
                      onChange={(e) => updateDriverB('address', e.target.value)}
                      placeholder="456 avenue des Roses, 75002 Paris"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverB-license">N° de permis</Label>
                    <Input
                      id="driverB-license"
                      value={driverB.licenseNumber}
                      onChange={(e) => updateDriverB('licenseNumber', e.target.value)}
                      placeholder="87654321"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverB-license-date">Date du permis</Label>
                    <Input
                      id="driverB-license-date"
                      type="date"
                      value={driverB.licenseDate}
                      onChange={(e) => updateDriverB('licenseDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverB-phone">Téléphone</Label>
                    <Input
                      id="driverB-phone"
                      value={driverB.phone}
                      onChange={(e) => updateDriverB('phone', e.target.value)}
                      placeholder="06 98 76 54 32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverB-email">Email</Label>
                    <Input
                      id="driverB-email"
                      type="email"
                      value={driverB.email}
                      onChange={(e) => updateDriverB('email', e.target.value)}
                      placeholder="pierre.martin@email.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-constalib-blue" />
                  Assuré du véhicule B
                </CardTitle>
                <CardDescription>
                  Informations sur le titulaire de la police d'assurance du véhicule B
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 pb-4">
                  <Switch 
                    id="insuredB-is-driver" 
                    checked={insuredB.isDriver}
                    onCheckedChange={(checked) => updateInsuredB('isDriver', checked)}
                  />
                  <Label htmlFor="insuredB-is-driver">L'assuré est le conducteur</Label>
                </div>

                <Separator />

                <div className={`space-y-4 pt-4 ${insuredB.isDriver ? 'opacity-50' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuredB-name">Nom et prénom</Label>
                      <Input
                        id="insuredB-name"
                        value={insuredB.fullName}
                        onChange={(e) => updateInsuredB('fullName', e.target.value)}
                        placeholder="Pierre Martin"
                        disabled={insuredB.isDriver}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuredB-address">Adresse</Label>
                      <Input
                        id="insuredB-address"
                        value={insuredB.address}
                        onChange={(e) => updateInsuredB('address', e.target.value)}
                        placeholder="456 avenue des Roses, 75002 Paris"
                        disabled={insuredB.isDriver}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuredB-phone">Téléphone</Label>
                      <Input
                        id="insuredB-phone"
                        value={insuredB.phone}
                        onChange={(e) => updateInsuredB('phone', e.target.value)}
                        placeholder="06 98 76 54 32"
                        disabled={insuredB.isDriver}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuredB-email">Email</Label>
                      <Input
                        id="insuredB-email"
                        type="email"
                        value={insuredB.email}
                        onChange={(e) => updateInsuredB('email', e.target.value)}
                        placeholder="pierre.martin@email.com"
                        disabled={insuredB.isDriver}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuredB-policy">N° de police d'assurance</Label>
                    <Input
                      id="insuredB-policy"
                      value={insuredB.policyNumber}
                      onChange={(e) => updateInsuredB('policyNumber', e.target.value)}
                      placeholder="POL987654321"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriversInsuredStep;
