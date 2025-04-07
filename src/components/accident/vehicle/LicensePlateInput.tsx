
import { useState } from 'react';
import { Search, AlertCircle, Loader2, Check, Car, UserCheck, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSivLicensePlate, formatFniLicensePlate } from '../utils/licensePlateFormatters';

interface LicensePlateInputProps {
  licensePlate: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSearchTab: (tab: 'siv' | 'fni') => void;
  searchTab: 'siv' | 'fni';
  onLookupVehicle: () => void;
  onLookupFni: () => void;
  onLookupFva: () => void;
  isLoading: boolean;
  isFvaLoading: boolean;
  isFniLoading: boolean;
  lookupSuccess: boolean;
  fniLookupSuccess: boolean;
  searchError: string | null;
  fniError: string | null;
  fvaError: string | null;
}

const LicensePlateInput = ({
  licensePlate,
  handleInputChange,
  onSearchTab,
  searchTab,
  onLookupVehicle,
  onLookupFni,
  onLookupFva,
  isLoading,
  isFvaLoading,
  isFniLoading,
  lookupSuccess,
  fniLookupSuccess,
  searchError,
  fniError,
  fvaError
}: LicensePlateInputProps) => {
  
  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formattedValue = e.target.value;
    
    if (searchTab === 'siv') {
      formattedValue = formatSivLicensePlate(e.target.value);
    } else if (searchTab === 'fni') {
      formattedValue = formatFniLicensePlate(e.target.value);
    }
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue,
        name: 'licensePlate'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };

  const handleTabChange = (value: string) => {
    onSearchTab(value as 'siv' | 'fni');
    
    if (licensePlate) {
      const formattedValue = value === 'siv' 
        ? formatSivLicensePlate(licensePlate)
        : formatFniLicensePlate(licensePlate);
        
      const syntheticEvent = {
        target: {
          value: formattedValue,
          name: 'licensePlate'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="licensePlate" className="block text-sm font-medium text-constalib-dark">
        Immatriculation du véhicule
      </label>
      
      <Tabs value={searchTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="siv" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            SIV (Depuis 2009)
          </TabsTrigger>
          <TabsTrigger value="fni" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            FNI (Avant 2009)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="siv" className="mt-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={licensePlate}
                onChange={handleLicensePlateChange}
                placeholder="AB-123-CD"
                className="pr-12"
                maxLength={9}
                required
              />
              <Button 
                type="button" 
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={onLookupVehicle}
                disabled={isLoading}
                title="Consulter le SIV (Système d'Immatriculation des Véhicules)"
              >
                {isLoading ? 
                  <Loader2 className="h-5 w-5 animate-spin text-constalib-blue" /> : 
                  lookupSuccess && !fniLookupSuccess ? 
                    <Check className="h-5 w-5 text-green-600" /> :
                    <Search className="h-5 w-5 text-constalib-blue" />
                }
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onLookupFva}
              disabled={isFvaLoading || !licensePlate}
              className="shrink-0"
              title="Consulter le FVA (Fichier des Véhicules Assurés)"
            >
              {isFvaLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="h-4 w-4 mr-2" />
              )}
              Vérifier FVA
            </Button>
          </div>
          <p className="text-xs text-constalib-dark-gray">
            Format du SIV (post-2009): AB-123-CD. Utilisez le bouton "Vérifier FVA" pour consulter le Fichier des Véhicules Assurés.
          </p>
        </TabsContent>
        
        <TabsContent value="fni" className="mt-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={licensePlate}
                onChange={handleLicensePlateChange}
                placeholder="123 ABC 75"
                className="pr-12"
                maxLength={10}
                required
              />
              <Button 
                type="button" 
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={onLookupFni}
                disabled={isFniLoading}
                title="Consulter le FNI (Fichier National des Immatriculations)"
              >
                {isFniLoading ? 
                  <Loader2 className="h-5 w-5 animate-spin text-constalib-blue" /> : 
                  fniLookupSuccess ? 
                    <Check className="h-5 w-5 text-green-600" /> :
                    <Search className="h-5 w-5 text-constalib-blue" />
                }
              </Button>
            </div>
            <Button
              type="button"
              variant="default"
              onClick={onLookupFni}
              disabled={isFniLoading || !licensePlate}
              className="shrink-0"
            >
              {isFniLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Consulter FNI
            </Button>
          </div>
          <p className="text-xs text-constalib-dark-gray">
            Format du FNI (avant 2009): 123 ABC 75 (numéros, lettres, département optionnel). Pour les véhicules immatriculés avant 2009.
          </p>
        </TabsContent>
      </Tabs>
      
      {searchError && searchTab === 'siv' && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}
      
      {fniError && searchTab === 'fni' && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fniError}</AlertDescription>
        </Alert>
      )}
      
      {fvaError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fvaError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LicensePlateInput;
