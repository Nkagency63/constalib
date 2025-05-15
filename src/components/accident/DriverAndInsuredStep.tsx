
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormData } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, UserRound } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface DriverAndInsuredStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DriverAndInsuredStep = ({ formData, handleInputChange }: DriverAndInsuredStepProps) => {
  const [showDriverInfo, setShowDriverInfo] = useState({
    A: true,
    B: true
  });
  
  const [showInsuredInfo, setShowInsuredInfo] = useState({
    A: true,
    B: true
  });
  
  const toggleDriverInfo = (vehicle: 'A' | 'B') => {
    setShowDriverInfo({
      ...showDriverInfo,
      [vehicle]: !showDriverInfo[vehicle]
    });
  };
  
  const toggleInsuredInfo = (vehicle: 'A' | 'B') => {
    setShowInsuredInfo({
      ...showInsuredInfo,
      [vehicle]: !showInsuredInfo[vehicle]
    });
  };
  
  // Compléter automatiquement l'assuré avec les informations du conducteur
  const copyDriverToInsured = (vehicle: 'A' | 'B') => {
    // Création d'un faux événement pour simuler la saisie utilisateur
    const createFakeChangeEvent = (name: string, value: string) => {
      return {
        target: {
          name,
          value
        }
      } as React.ChangeEvent<HTMLInputElement>;
    };
    
    if (vehicle === 'A') {
      handleInputChange(createFakeChangeEvent('insuredName', formData.driverName || ''));
      handleInputChange(createFakeChangeEvent('insuredPhone', formData.driverPhone || ''));
      handleInputChange(createFakeChangeEvent('insuredAddress', formData.driverAddress || ''));
    } else {
      handleInputChange(createFakeChangeEvent('otherInsuredName', formData.otherDriverName || ''));
      handleInputChange(createFakeChangeEvent('otherInsuredPhone', formData.otherDriverPhone || ''));
      handleInputChange(createFakeChangeEvent('otherInsuredAddress', formData.otherDriverAddress || ''));
    }
  };
  
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Ces informations seront utilisées dans le constat amiable pour identifier le conducteur et l'assuré.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="vehicleA" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="vehicleA">Votre véhicule (A)</TabsTrigger>
          <TabsTrigger value="vehicleB">Véhicule adverse (B)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicleA" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <UserRound className="mr-2 h-5 w-5" />
                  Conducteur (Véhicule A)
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleDriverInfo('A')}
                >
                  {showDriverInfo.A ? "Masquer" : "Afficher"}
                </Button>
              </div>
              
              {showDriverInfo.A && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="driverName" className="block text-sm font-medium">
                        Nom et prénom
                      </label>
                      <Input
                        id="driverName"
                        name="driverName"
                        value={formData.driverName || ''}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="driverPhone" className="block text-sm font-medium">
                        Téléphone
                      </label>
                      <Input
                        id="driverPhone"
                        name="driverPhone"
                        value={formData.driverPhone || ''}
                        onChange={handleInputChange}
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="driverAddress" className="block text-sm font-medium">
                      Adresse
                    </label>
                    <Textarea
                      id="driverAddress"
                      name="driverAddress"
                      value={formData.driverAddress || ''}
                      onChange={handleInputChange}
                      placeholder="123 rue exemple, 75000 Paris"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="driverLicense" className="block text-sm font-medium">
                      Numéro de permis de conduire
                    </label>
                    <Input
                      id="driverLicense"
                      name="driverLicense"
                      value={formData.driverLicense || ''}
                      onChange={handleInputChange}
                      placeholder="12AB34567890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="driverLicenseDate" className="block text-sm font-medium">
                      Date d'obtention du permis
                    </label>
                    <Input
                      id="driverLicenseDate"
                      name="driverLicenseDate"
                      type="date"
                      value={formData.driverLicenseDate || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Assuré / Preneur d'assurance (Véhicule A)
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyDriverToInsured('A')}
                  >
                    Copier du conducteur
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleInsuredInfo('A')}
                  >
                    {showInsuredInfo.A ? "Masquer" : "Afficher"}
                  </Button>
                </div>
              </div>
              
              {showInsuredInfo.A && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="insuredName" className="block text-sm font-medium">
                        Nom et prénom
                      </label>
                      <Input
                        id="insuredName"
                        name="insuredName"
                        value={formData.insuredName || ''}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="insuredPhone" className="block text-sm font-medium">
                        Téléphone
                      </label>
                      <Input
                        id="insuredPhone"
                        name="insuredPhone"
                        value={formData.insuredPhone || ''}
                        onChange={handleInputChange}
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="insuredAddress" className="block text-sm font-medium">
                      Adresse
                    </label>
                    <Textarea
                      id="insuredAddress"
                      name="insuredAddress"
                      value={formData.insuredAddress || ''}
                      onChange={handleInputChange}
                      placeholder="123 rue exemple, 75000 Paris"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="insuredEmail" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="insuredEmail"
                      name="insuredEmail"
                      value={formData.insuredEmail || ''}
                      onChange={handleInputChange}
                      placeholder="exemple@email.com"
                      type="email"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicleB" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <UserRound className="mr-2 h-5 w-5" />
                  Conducteur (Véhicule B)
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleDriverInfo('B')}
                >
                  {showDriverInfo.B ? "Masquer" : "Afficher"}
                </Button>
              </div>
              
              {showDriverInfo.B && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="otherDriverName" className="block text-sm font-medium">
                        Nom et prénom
                      </label>
                      <Input
                        id="otherDriverName"
                        name="otherDriverName"
                        value={formData.otherDriverName || ''}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="otherDriverPhone" className="block text-sm font-medium">
                        Téléphone
                      </label>
                      <Input
                        id="otherDriverPhone"
                        name="otherDriverPhone"
                        value={formData.otherDriverPhone || ''}
                        onChange={handleInputChange}
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="otherDriverAddress" className="block text-sm font-medium">
                      Adresse
                    </label>
                    <Textarea
                      id="otherDriverAddress"
                      name="otherDriverAddress"
                      value={formData.otherDriverAddress || ''}
                      onChange={handleInputChange}
                      placeholder="123 rue exemple, 75000 Paris"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="otherDriverLicense" className="block text-sm font-medium">
                      Numéro de permis de conduire
                    </label>
                    <Input
                      id="otherDriverLicense"
                      name="otherDriverLicense"
                      value={formData.otherDriverLicense || ''}
                      onChange={handleInputChange}
                      placeholder="12AB34567890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="otherDriverLicenseDate" className="block text-sm font-medium">
                      Date d'obtention du permis
                    </label>
                    <Input
                      id="otherDriverLicenseDate"
                      name="otherDriverLicenseDate"
                      type="date"
                      value={formData.otherDriverLicenseDate || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Assuré / Preneur d'assurance (Véhicule B)
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyDriverToInsured('B')}
                  >
                    Copier du conducteur
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleInsuredInfo('B')}
                  >
                    {showInsuredInfo.B ? "Masquer" : "Afficher"}
                  </Button>
                </div>
              </div>
              
              {showInsuredInfo.B && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="otherInsuredName" className="block text-sm font-medium">
                        Nom et prénom
                      </label>
                      <Input
                        id="otherInsuredName"
                        name="otherInsuredName"
                        value={formData.otherInsuredName || ''}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="otherInsuredPhone" className="block text-sm font-medium">
                        Téléphone
                      </label>
                      <Input
                        id="otherInsuredPhone"
                        name="otherInsuredPhone"
                        value={formData.otherInsuredPhone || ''}
                        onChange={handleInputChange}
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="otherInsuredAddress" className="block text-sm font-medium">
                      Adresse
                    </label>
                    <Textarea
                      id="otherInsuredAddress"
                      name="otherInsuredAddress"
                      value={formData.otherInsuredAddress || ''}
                      onChange={handleInputChange}
                      placeholder="123 rue exemple, 75000 Paris"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="otherInsuredEmail" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="otherInsuredEmail"
                      name="otherInsuredEmail"
                      value={formData.otherInsuredEmail || ''}
                      onChange={handleInputChange}
                      placeholder="exemple@email.com"
                      type="email"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverAndInsuredStep;
