
import React from 'react';
import { Input } from "@/components/ui/input";

interface DriverAndInsuredStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DriverAndInsuredStep: React.FC<DriverAndInsuredStepProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-constalib-dark">Conducteur du véhicule</h3>
        
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
    </div>
  );
};

export default DriverAndInsuredStep;
