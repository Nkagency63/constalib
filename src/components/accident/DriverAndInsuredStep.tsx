
import React from 'react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Truck } from 'lucide-react';

interface DriverAndInsuredStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  vehicleId?: 'A' | 'B';
  setVehicleId?: (id: 'A' | 'B') => void;
}

const DriverAndInsuredStep: React.FC<DriverAndInsuredStepProps> = ({ 
  formData, 
  handleInputChange,
  vehicleId = 'A',
  setVehicleId = () => {}
}) => {
  return (
    <div className="space-y-8">
      <Tabs 
        defaultValue={vehicleId} 
        onValueChange={(value) => setVehicleId(value as 'A' | 'B')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="A" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>Votre véhicule (A)</span>
          </TabsTrigger>
          <TabsTrigger value="B" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Autre véhicule (B)</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Vehicle A Driver and Insured */}
        <TabsContent value="A" className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-constalib-dark">Conducteur du véhicule A</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="driverName" className="block text-sm font-medium text-constalib-dark">
                  Nom et prénom
                </label>
                <Input
                  id="driverName"
                  name="driverName"
                  type="text"
                  value={formData.driverName || ''}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="driverAddress" className="block text-sm font-medium text-constalib-dark">
                  Adresse
                </label>
                <Input
                  id="driverAddress"
                  name="driverAddress"
                  type="text"
                  value={formData.driverAddress || ''}
                  onChange={handleInputChange}
                  placeholder="123 Rue Principale, 75001 Paris"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="driverPhone" className="block text-sm font-medium text-constalib-dark">
                  Téléphone
                </label>
                <Input
                  id="driverPhone"
                  name="driverPhone"
                  type="tel"
                  value={formData.driverPhone || ''}
                  onChange={handleInputChange}
                  placeholder="06 12 34 56 78"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="driverLicense" className="block text-sm font-medium text-constalib-dark">
                  Permis de conduire N°
                </label>
                <Input
                  id="driverLicense"
                  name="driverLicense"
                  type="text"
                  value={formData.driverLicense || ''}
                  onChange={handleInputChange}
                  placeholder="123456789"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="driverLicenseDate" className="block text-sm font-medium text-constalib-dark">
                  Date d'obtention du permis
                </label>
                <Input
                  id="driverLicenseDate"
                  name="driverLicenseDate"
                  type="date"
                  value={formData.driverLicenseDate || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-constalib-dark">Assuré (si différent du conducteur)</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="insuredName" className="block text-sm font-medium text-constalib-dark">
                  Nom et prénom
                </label>
                <Input
                  id="insuredName"
                  name="insuredName"
                  type="text"
                  value={formData.insuredName || ''}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="insuredAddress" className="block text-sm font-medium text-constalib-dark">
                  Adresse
                </label>
                <Input
                  id="insuredAddress"
                  name="insuredAddress"
                  type="text"
                  value={formData.insuredAddress || ''}
                  onChange={handleInputChange}
                  placeholder="456 Rue Secondaire, 75002 Paris"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="insuredPhone" className="block text-sm font-medium text-constalib-dark">
                  Téléphone
                </label>
                <Input
                  id="insuredPhone"
                  name="insuredPhone"
                  type="tel"
                  value={formData.insuredPhone || ''}
                  onChange={handleInputChange}
                  placeholder="06 98 76 54 32"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="insuredEmail" className="block text-sm font-medium text-constalib-dark">
                  Email
                </label>
                <Input
                  id="insuredEmail"
                  name="insuredEmail"
                  type="email"
                  value={formData.insuredEmail || ''}
                  onChange={handleInputChange}
                  placeholder="jane.doe@example.com"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Vehicle B Driver and Insured */}
        <TabsContent value="B" className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-constalib-dark">Conducteur du véhicule B</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otherDriverName" className="block text-sm font-medium text-constalib-dark">
                  Nom et prénom
                </label>
                <Input
                  id="otherDriverName"
                  name="otherDriverName"
                  type="text"
                  value={formData.otherDriverName || ''}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otherDriverAddress" className="block text-sm font-medium text-constalib-dark">
                  Adresse
                </label>
                <Input
                  id="otherDriverAddress"
                  name="otherDriverAddress"
                  type="text"
                  value={formData.otherDriverAddress || ''}
                  onChange={handleInputChange}
                  placeholder="789 Rue Principale, 75001 Paris"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otherDriverPhone" className="block text-sm font-medium text-constalib-dark">
                  Téléphone
                </label>
                <Input
                  id="otherDriverPhone"
                  name="otherDriverPhone"
                  type="tel"
                  value={formData.otherDriverPhone || ''}
                  onChange={handleInputChange}
                  placeholder="06 12 34 56 78"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otherDriverLicense" className="block text-sm font-medium text-constalib-dark">
                  Permis de conduire N°
                </label>
                <Input
                  id="otherDriverLicense"
                  name="otherDriverLicense"
                  type="text"
                  value={formData.otherDriverLicense || ''}
                  onChange={handleInputChange}
                  placeholder="123456789"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otherDriverLicenseDate" className="block text-sm font-medium text-constalib-dark">
                  Date d'obtention du permis
                </label>
                <Input
                  id="otherDriverLicenseDate"
                  name="otherDriverLicenseDate"
                  type="date"
                  value={formData.otherDriverLicenseDate || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-constalib-dark">Assuré (si différent du conducteur)</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otherInsuredName" className="block text-sm font-medium text-constalib-dark">
                  Nom et prénom
                </label>
                <Input
                  id="otherInsuredName"
                  name="otherInsuredName"
                  type="text"
                  value={formData.otherInsuredName || ''}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otherInsuredAddress" className="block text-sm font-medium text-constalib-dark">
                  Adresse
                </label>
                <Input
                  id="otherInsuredAddress"
                  name="otherInsuredAddress"
                  type="text"
                  value={formData.otherInsuredAddress || ''}
                  onChange={handleInputChange}
                  placeholder="456 Rue Secondaire, 75002 Paris"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otherInsuredPhone" className="block text-sm font-medium text-constalib-dark">
                  Téléphone
                </label>
                <Input
                  id="otherInsuredPhone"
                  name="otherInsuredPhone"
                  type="tel"
                  value={formData.otherInsuredPhone || ''}
                  onChange={handleInputChange}
                  placeholder="06 98 76 54 32"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otherInsuredEmail" className="block text-sm font-medium text-constalib-dark">
                  Email
                </label>
                <Input
                  id="otherInsuredEmail"
                  name="otherInsuredEmail"
                  type="email"
                  value={formData.otherInsuredEmail || ''}
                  onChange={handleInputChange}
                  placeholder="jane.smith@example.com"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverAndInsuredStep;
