
import { useState } from 'react';
import { Car, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SivTabContent from './tabs/SivTabContent';
import FniTabContent from './tabs/FniTabContent';
import ErrorAlerts from './ErrorAlerts';
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
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
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
          name: 'licensePlate',
          value: formattedValue
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
        
        <TabsContent value="siv">
          <SivTabContent 
            licensePlate={licensePlate}
            handleLicensePlateChange={handleLicensePlateChange}
            onLookupVehicle={onLookupVehicle}
            onLookupFva={onLookupFva}
            isLoading={isLoading}
            isFvaLoading={isFvaLoading}
            lookupSuccess={lookupSuccess}
          />
        </TabsContent>
        
        <TabsContent value="fni">
          <FniTabContent 
            licensePlate={licensePlate}
            handleLicensePlateChange={handleLicensePlateChange}
            onLookupFni={onLookupFni}
            isFniLoading={isFniLoading}
            fniLookupSuccess={fniLookupSuccess}
          />
        </TabsContent>
      </Tabs>
      
      <ErrorAlerts 
        searchError={searchError}
        fniError={fniError}
        fvaError={fvaError}
        searchTab={searchTab}
      />
    </div>
  );
};

export default LicensePlateInput;
