
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, FileText, Copy, ClipboardCopy } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface DriverAndInsuredStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DriverAndInsuredStep: React.FC<DriverAndInsuredStepProps> = ({
  formData,
  handleInputChange
}) => {
  const [driverIsInsuredA, setDriverIsInsuredA] = useState(false);
  const [driverIsInsuredB, setDriverIsInsuredB] = useState(false);

  // Check on component mount if driver and insured info are the same
  useEffect(() => {
    // For vehicle A
    if (formData.driverName && formData.insuredName && 
        formData.driverName === formData.insuredName &&
        formData.driverAddress === formData.insuredAddress &&
        formData.driverPhone === formData.insuredPhone) {
      setDriverIsInsuredA(true);
    }
    
    // For vehicle B
    if (formData.otherDriverName && formData.otherInsuredName && 
        formData.otherDriverName === formData.otherInsuredName &&
        formData.otherDriverAddress === formData.otherInsuredAddress &&
        formData.otherDriverPhone === formData.otherInsuredPhone) {
      setDriverIsInsuredB(true);
    }
  }, [formData]);

  // Handler for copying driver information to insured fields for vehicle A
  const copyDriverToInsuredA = () => {
    const isChecked = !driverIsInsuredA;
    setDriverIsInsuredA(isChecked);
    
    if (isChecked) {
      // Create synthetic events to update insured info based on driver info
      const createEvent = (name: string, value: string) => ({
        target: { name, value },
      } as React.ChangeEvent<HTMLInputElement>);
      
      if (formData.driverName) {
        handleInputChange(createEvent('insuredName', formData.driverName));
      }
      
      if (formData.driverAddress) {
        handleInputChange(createEvent('insuredAddress', formData.driverAddress));
      }
      
      if (formData.driverPhone) {
        handleInputChange(createEvent('insuredPhone', formData.driverPhone));
      }
      
      toast.success("Informations copiées", {
        description: "Les informations du conducteur ont été copiées vers l'assuré"
      });
    }
  };
  
  // Handler for copying driver information to insured fields for vehicle B
  const copyDriverToInsuredB = () => {
    const isChecked = !driverIsInsuredB;
    setDriverIsInsuredB(isChecked);
    
    if (isChecked) {
      // Create synthetic events to update insured info based on driver info
      const createEvent = (name: string, value: string) => ({
        target: { name, value },
      } as React.ChangeEvent<HTMLInputElement>);
      
      if (formData.otherDriverName) {
        handleInputChange(createEvent('otherInsuredName', formData.otherDriverName));
      }
      
      if (formData.otherDriverAddress) {
        handleInputChange(createEvent('otherInsuredAddress', formData.otherDriverAddress));
      }
      
      if (formData.otherDriverPhone) {
        handleInputChange(createEvent('otherInsuredPhone', formData.otherDriverPhone));
      }
      
      toast.success("Informations copiées", {
        description: "Les informations du conducteur ont été copiées vers l'assuré"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vehicle-a" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="vehicle-a" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>Conducteur A (vous)</span>
          </TabsTrigger>
          <TabsTrigger value="vehicle-b" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>Conducteur B (tiers)</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicle-a">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-constalib-dark">
                Véhicule A ({formData.vehicleBrand} {formData.vehicleModel})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-constalib-dark mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Conducteur
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Nom et prénom</Label>
                    <Input
                      id="driverName"
                      name="driverName"
                      value={formData.driverName || ''}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverAddress">Adresse</Label>
                    <Textarea
                      id="driverAddress"
                      name="driverAddress"
                      value={formData.driverAddress || ''}
                      onChange={handleInputChange}
                      placeholder="123 rue de Paris, 75001 Paris"
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverPhone">Téléphone</Label>
                    <Input
                      id="driverPhone"
                      name="driverPhone"
                      value={formData.driverPhone || ''}
                      onChange={handleInputChange}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverLicense">Permis de conduire n°</Label>
                    <Input
                      id="driverLicense"
                      name="driverLicense"
                      value={formData.driverLicense || ''}
                      onChange={handleInputChange}
                      placeholder="12AB34567890"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-constalib-dark flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Assuré
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="driverIsInsuredA" 
                      checked={driverIsInsuredA} 
                      onCheckedChange={copyDriverToInsuredA} 
                    />
                    <Label htmlFor="driverIsInsuredA" className="text-sm text-gray-600 cursor-pointer flex items-center">
                      <Copy className="h-4 w-4 mr-1 text-gray-500" />
                      Le conducteur est l'assuré
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuredName">Nom et prénom</Label>
                    <Input
                      id="insuredName"
                      name="insuredName"
                      value={formData.insuredName || ''}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuredAddress">Adresse</Label>
                    <Textarea
                      id="insuredAddress"
                      name="insuredAddress"
                      value={formData.insuredAddress || ''}
                      onChange={handleInputChange}
                      placeholder="123 rue de Paris, 75001 Paris"
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuredPhone">Téléphone</Label>
                    <Input
                      id="insuredPhone"
                      name="insuredPhone"
                      value={formData.insuredPhone || ''}
                      onChange={handleInputChange}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>
                {!driverIsInsuredA && formData.driverName && formData.insuredName === '' && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={copyDriverToInsuredA}
                  >
                    <ClipboardCopy className="h-3 w-3 mr-1" />
                    Copier les informations du conducteur
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicle-b">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-constalib-dark">
                Véhicule B ({formData.otherVehicle?.brand || ''} {formData.otherVehicle?.model || ''})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-constalib-dark mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Conducteur
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otherDriverName">Nom et prénom</Label>
                    <Input
                      id="otherDriverName"
                      name="otherDriverName"
                      value={formData.otherDriverName || ''}
                      onChange={handleInputChange}
                      placeholder="Michel Martin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherDriverAddress">Adresse</Label>
                    <Textarea
                      id="otherDriverAddress"
                      name="otherDriverAddress"
                      value={formData.otherDriverAddress || ''}
                      onChange={handleInputChange}
                      placeholder="456 avenue de Lyon, 69002 Lyon"
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherDriverPhone">Téléphone</Label>
                    <Input
                      id="otherDriverPhone"
                      name="otherDriverPhone"
                      value={formData.otherDriverPhone || ''}
                      onChange={handleInputChange}
                      placeholder="07 98 76 54 32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherDriverLicense">Permis de conduire n°</Label>
                    <Input
                      id="otherDriverLicense"
                      name="otherDriverLicense"
                      value={formData.otherDriverLicense || ''}
                      onChange={handleInputChange}
                      placeholder="98ZY76543210"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-constalib-dark flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Assuré
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="driverIsInsuredB" 
                      checked={driverIsInsuredB} 
                      onCheckedChange={copyDriverToInsuredB} 
                    />
                    <Label htmlFor="driverIsInsuredB" className="text-sm text-gray-600 cursor-pointer flex items-center">
                      <Copy className="h-4 w-4 mr-1 text-gray-500" />
                      Le conducteur est l'assuré
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otherInsuredName">Nom et prénom</Label>
                    <Input
                      id="otherInsuredName"
                      name="otherInsuredName"
                      value={formData.otherInsuredName || ''}
                      onChange={handleInputChange}
                      placeholder="Michel Martin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherInsuredAddress">Adresse</Label>
                    <Textarea
                      id="otherInsuredAddress"
                      name="otherInsuredAddress"
                      value={formData.otherInsuredAddress || ''}
                      onChange={handleInputChange}
                      placeholder="456 avenue de Lyon, 69002 Lyon"
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherInsuredPhone">Téléphone</Label>
                    <Input
                      id="otherInsuredPhone"
                      name="otherInsuredPhone"
                      value={formData.otherInsuredPhone || ''}
                      onChange={handleInputChange}
                      placeholder="07 98 76 54 32"
                    />
                  </div>
                </div>
                {!driverIsInsuredB && formData.otherDriverName && formData.otherInsuredName === '' && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={copyDriverToInsuredB}
                  >
                    <ClipboardCopy className="h-3 w-3 mr-1" />
                    Copier les informations du conducteur
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Assurez-vous de saisir correctement les informations des conducteurs et assurés. 
          Ces informations sont cruciales pour le traitement de votre déclaration d'accident.
        </p>
      </div>
    </div>
  );
};

export default DriverAndInsuredStep;
