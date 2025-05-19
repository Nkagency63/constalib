
import React from 'react';
import { Input } from "@/components/ui/input";
import { Car, UserCheck } from 'lucide-react';
import LookupButton from '../buttons/LookupButton';
import { formatFniLicensePlate } from '../../utils/licensePlateFormatters';
import { Button } from "@/components/ui/button";
import { validateLicensePlate } from '../../hooks/vehicle/vehicleLookupValidators';
import { toast } from 'sonner';

interface FniTabContentProps {
  licensePlate: string;
  handleLicensePlateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLookupFni: () => void;
  isFniLoading: boolean;
  fniLookupSuccess: boolean;
}

const FniTabContent = ({
  licensePlate,
  handleLicensePlateChange,
  onLookupFni,
  isFniLoading,
  fniLookupSuccess
}: FniTabContentProps) => {
  // Format the license plate as the user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatFniLicensePlate(e.target.value);
    
    // Create a synthetic event with the formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    // Pass the synthetic event to the parent handler
    handleLicensePlateChange(syntheticEvent);
  };
  
  const handleLookupFni = () => {
    if (!validateLicensePlate(licensePlate, 'fni')) {
      toast.error("Format d'immatriculation invalide. Utilisez le format 123 ABC 75");
      return;
    }
    onLookupFni();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={licensePlate}
            onChange={handleInputChange}
            placeholder="123 ABC 75"
            className="pr-12"
            maxLength={10}
            required
          />
          <LookupButton 
            isLoading={isFniLoading}
            lookupSuccess={fniLookupSuccess}
            onClick={handleLookupFni}
            tooltip="Consulter le FNI (Fichier National des Immatriculations)"
          />
        </div>
      </div>
      
      <p className="text-xs text-constalib-dark-gray">
        Format du FNI (pre-2009): 123 ABC 75. Le FNI contient les anciennes plaques d'immatriculation.
      </p>
    </div>
  );
};

export default FniTabContent;
