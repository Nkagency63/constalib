import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Car, Truck, AlertTriangle, FileSearch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MultiVehicleStepProps } from './types/props';
import { formatSivLicensePlate, formatFniLicensePlate } from './utils/licensePlateFormatters';
import LookupButton from './vehicle/buttons/LookupButton';
import ActionButton from './vehicle/buttons/ActionButton';

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
  emergencyContacted,
  handlePhotoUpload,
  // Vehicle A lookup methods
  lookupVehicle,
  lookupFni,
  lookupFva,
  isLoading,
  isFvaLoading,
  isFniLoading,
  lookupSuccess,
  fvaLookupSuccess,
  fniLookupSuccess,
  searchError,
  fvaError,
  fniError,
  hasAttemptedLookup,
  searchTab,
  onSearchTabChange,
  // Vehicle B lookup methods
  lookupOtherVehicle,
  lookupOtherFni,
  lookupOtherFva,
  otherIsLoading,
  otherIsFvaLoading,
  otherIsFniLoading,
  otherLookupSuccess,
  otherFvaLookupSuccess,
  otherFniLookupSuccess,
  otherSearchError,
  otherFvaError,
  otherFniError,
  otherHasAttemptedLookup
}) => {
  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>, isOtherVehicle: boolean) => {
    const { value } = e.target;
    
    // Format the license plate according to the selected tab
    const formattedValue = searchTab === 'siv' ? 
      formatSivLicensePlate(value) : 
      formatFniLicensePlate(value);
    
    // Create a synthetic event with the formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'licensePlate',
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    if (isOtherVehicle) {
      handleOtherVehicleChange(syntheticEvent);
    } else {
      handleInputChange(syntheticEvent);
    }
  };

  const handleTabChange = (value: string) => {
    onSearchTabChange(value as 'siv' | 'fni');
    
    // Format the license plate according to the selected tab format
    if (vehicleId === 'A' && licensePlate) {
      const formattedValue = value === 'siv' ? 
        formatSivLicensePlate(licensePlate) : 
        formatFniLicensePlate(licensePlate);
      
      const syntheticEvent = {
        target: {
          name: 'licensePlate',
          value: formattedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    } else if (vehicleId === 'B' && otherVehicle.licensePlate) {
      const formattedValue = value === 'siv' ? 
        formatSivLicensePlate(otherVehicle.licensePlate) : 
        formatFniLicensePlate(otherVehicle.licensePlate);
      
      const syntheticEvent = {
        target: {
          name: 'licensePlate',
          value: formattedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleOtherVehicleChange(syntheticEvent);
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
            
            <Tabs value={searchTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="siv" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>SIV (Après 2009)</span>
                </TabsTrigger>
                <TabsTrigger value="fni" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>FNI (Avant 2009)</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="siv">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-grow">
                    <Input
                      id="licensePlate"
                      name="licensePlate"
                      value={licensePlate || ''}
                      onChange={(e) => handleLicensePlateChange(e, false)}
                      placeholder="AB-123-CD"
                      className="pr-12"
                      maxLength={9}
                    />
                    <LookupButton 
                      isLoading={isLoading}
                      lookupSuccess={lookupSuccess}
                      onClick={lookupVehicle}
                      tooltip="Consulter le SIV (Système d'Immatriculation des Véhicules)"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mb-2">
                  <ActionButton
                    isLoading={isFvaLoading}
                    onClick={lookupFva}
                    disabled={!licensePlate}
                    Icon={FileSearch}
                    label="Consulter le Fichier des Véhicules Assurés (FVA)"
                    variant="default"
                    tooltip="Consulter le FVA pour obtenir les informations complètes du véhicule et de son assurance"
                  />
                </div>
                
                {searchError && (
                  <Alert variant="destructive" className="mt-2 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{searchError}</AlertDescription>
                  </Alert>
                )}
                
                {fvaError && (
                  <Alert variant="destructive" className="mt-2 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fvaError}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="fni">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-grow">
                    <Input
                      id="licensePlate"
                      name="licensePlate"
                      value={licensePlate || ''}
                      onChange={(e) => handleLicensePlateChange(e, false)}
                      placeholder="123 ABC 75"
                      className="pr-12"
                      maxLength={10}
                    />
                    <LookupButton 
                      isLoading={isFniLoading}
                      lookupSuccess={fniLookupSuccess}
                      onClick={lookupFni}
                      tooltip="Consulter le FNI (Fichier National des Immatriculations)"
                    />
                  </div>
                </div>
                
                {fniError && (
                  <Alert variant="destructive" className="mt-2 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fniError}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
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
                readOnly={lookupSuccess || fvaLookupSuccess || fniLookupSuccess}
                className={lookupSuccess || fvaLookupSuccess || fniLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={lookupSuccess || fvaLookupSuccess || fniLookupSuccess}
                className={lookupSuccess || fvaLookupSuccess || fniLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={lookupSuccess || fvaLookupSuccess || fniLookupSuccess}
                className={lookupSuccess || fvaLookupSuccess || fniLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={lookupSuccess || fvaLookupSuccess || fniLookupSuccess}
                className={lookupSuccess || fvaLookupSuccess || fniLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={fvaLookupSuccess}
                className={fvaLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={fvaLookupSuccess}
                className={fvaLookupSuccess ? "bg-gray-50" : ""}
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
            
            <Tabs value={searchTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="siv" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>SIV (Après 2009)</span>
                </TabsTrigger>
                <TabsTrigger value="fni" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>FNI (Avant 2009)</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="siv">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-grow">
                    <Input
                      id="otherLicensePlate"
                      name="licensePlate"
                      value={otherVehicle.licensePlate || ''}
                      onChange={(e) => handleLicensePlateChange(e, true)}
                      placeholder="AB-123-CD"
                      className="pr-12"
                      maxLength={9}
                    />
                    <LookupButton 
                      isLoading={otherIsLoading}
                      lookupSuccess={otherLookupSuccess}
                      onClick={lookupOtherVehicle}
                      tooltip="Consulter le SIV (Système d'Immatriculation des Véhicules)"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mb-2">
                  <ActionButton
                    isLoading={otherIsFvaLoading}
                    onClick={lookupOtherFva}
                    disabled={!otherVehicle.licensePlate}
                    Icon={FileSearch}
                    label="Consulter le Fichier des Véhicules Assurés (FVA)"
                    variant="default"
                    tooltip="Consulter le FVA pour obtenir les informations complètes du véhicule et de son assurance"
                  />
                </div>
                
                {otherSearchError && (
                  <Alert variant="destructive" className="mt-2 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{otherSearchError}</AlertDescription>
                  </Alert>
                )}
                
                {otherFvaError && (
                  <Alert variant="destructive" className="mt-2 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{otherFvaError}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="fni">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-grow">
                    <Input
                      id="otherLicensePlate"
                      name="licensePlate"
                      value={otherVehicle.licensePlate || ''}
                      onChange={(e) => handleLicensePlateChange(e, true)}
                      placeholder="123 ABC 75"
                      className="pr-12"
                      maxLength={10}
                    />
                    <LookupButton 
                      isLoading={otherIsFniLoading}
                      lookupSuccess={otherFniLookupSuccess}
                      onClick={lookupOtherFni}
                      tooltip="Consulter le FNI (Fichier National des Immatriculations)"
                    />
                  </div>
                </div>
                
                {otherFniError && (
                  <Alert variant="destructive" className="mt-2 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{otherFniError}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="otherBrand">Marque</Label>
              <Input
                id="otherBrand"
                name="brand"
                value={otherVehicle.brand || ''}
                onChange={handleOtherVehicleChange}
                placeholder="Renault, Peugeot, etc."
                readOnly={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess}
                className={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess ? "bg-gray-50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherModel">Modèle</Label>
              <Input
                id="otherModel"
                name="model"
                value={otherVehicle.model || ''}
                onChange={handleOtherVehicleChange}
                placeholder="Clio, 308, etc."
                readOnly={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess}
                className={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess ? "bg-gray-50" : ""}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="otherYear">Année</Label>
              <Input
                id="otherYear"
                name="year"
                value={otherVehicle.year || ''}
                onChange={handleOtherVehicleChange}
                placeholder="2020"
                readOnly={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess}
                className={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess}
                className={otherLookupSuccess || otherFvaLookupSuccess || otherFniLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={otherFvaLookupSuccess}
                className={otherFvaLookupSuccess ? "bg-gray-50" : ""}
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
                readOnly={otherFvaLookupSuccess}
                className={otherFvaLookupSuccess ? "bg-gray-50" : ""}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otherDescription">Description du véhicule</Label>
            <textarea
              id="otherDescription"
              name="description"
              value={otherVehicle.description || ''}
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
            Ces informations sont essentielles pour le traitement de votre déclaration. Utilisez le FVA pour récupérer
            automatiquement les informations du véhicule et de son assurance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiVehicleStep;
