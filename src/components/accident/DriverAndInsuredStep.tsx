import React from 'react';

interface DriverInfo {
  name: string;
  address: string;
  phone: string;
  license: string;
}

interface InsuredInfo {
  name: string;
  address: string;
  phone: string;
}

export interface DriverAndInsuredStepProps {
  driver: DriverInfo;
  insured: InsuredInfo;
  otherDriver: DriverInfo;
  otherInsured: InsuredInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DriverAndInsuredStep: React.FC<DriverAndInsuredStepProps> = ({
  driver,
  insured,
  otherDriver,
  otherInsured,
  handleInputChange
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-constalib-dark mb-4">Véhicule A (votre véhicule)</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-constalib-dark mb-3">Conducteur</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="driverName" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={driver.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="driverAddress" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  id="driverAddress"
                  name="driverAddress"
                  value={driver.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="driverPhone" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="driverPhone"
                  name="driverPhone"
                  value={driver.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="driverLicense" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Permis de conduire n°
                </label>
                <input
                  type="text"
                  id="driverLicense"
                  name="driverLicense"
                  value={driver.license}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-constalib-dark mb-3">Assuré</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="insuredName" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  id="insuredName"
                  name="insuredName"
                  value={insured.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="insuredAddress" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  id="insuredAddress"
                  name="insuredAddress"
                  value={insured.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="insuredPhone" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="insuredPhone"
                  name="insuredPhone"
                  value={insured.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-constalib-dark mb-4">Véhicule B (autre véhicule)</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-constalib-dark mb-3">Conducteur</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="otherDriverName" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  id="otherDriverName"
                  name="otherDriverName"
                  value={otherDriver.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="otherDriverAddress" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  id="otherDriverAddress"
                  name="otherDriverAddress"
                  value={otherDriver.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="otherDriverPhone" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="otherDriverPhone"
                  name="otherDriverPhone"
                  value={otherDriver.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="otherDriverLicense" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Permis de conduire n°
                </label>
                <input
                  type="text"
                  id="otherDriverLicense"
                  name="otherDriverLicense"
                  value={otherDriver.license}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-constalib-dark mb-3">Assuré</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="otherInsuredName" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  id="otherInsuredName"
                  name="otherInsuredName"
                  value={otherInsured.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="otherInsuredAddress" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  id="otherInsuredAddress"
                  name="otherInsuredAddress"
                  value={otherInsured.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="otherInsuredPhone" className="block text-sm font-medium text-constalib-dark-gray mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="otherInsuredPhone"
                  name="otherInsuredPhone"
                  value={otherInsured.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAndInsuredStep;
