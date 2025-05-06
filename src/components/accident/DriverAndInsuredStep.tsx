
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormData } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DriverAndInsuredStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DriverAndInsuredStep = ({ formData, handleInputChange }: DriverAndInsuredStepProps) => {
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
          <div className="space-y-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Conducteur (Véhicule A)</h3>
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
          </div>
          
          <div className="space-y-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Assuré / Preneur d'assurance (Véhicule A)</h3>
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
          </div>
        </TabsContent>
        
        <TabsContent value="vehicleB" className="space-y-6">
          <div className="space-y-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Conducteur (Véhicule B)</h3>
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
          </div>
          
          <div className="space-y-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Assuré / Preneur d'assurance (Véhicule B)</h3>
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
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverAndInsuredStep;
