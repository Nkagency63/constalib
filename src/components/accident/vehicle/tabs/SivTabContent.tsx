
import React from 'react';
import { Input } from "@/components/ui/input";
import { Car, UserCheck, FileSearch } from 'lucide-react';
import LookupButton from '../buttons/LookupButton';
import ActionButton from '../buttons/ActionButton';
import { formatSivLicensePlate, isValidLicensePlate } from '../../utils/licensePlateFormatters';
import { Button } from "@/components/ui/button";
import { validateLicensePlate } from '../../hooks/vehicle/vehicleLookupValidators';
import { toast } from 'sonner';

interface SivTabContentProps {
  licensePlate: string;
  handleLicensePlateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLookupVehicle: () => void;
  onLookupFva: () => void;
  isLoading: boolean;
  isFvaLoading: boolean;
  lookupSuccess: boolean;
}

const SivTabContent = ({
  licensePlate,
  handleLicensePlateChange,
  onLookupVehicle,
  onLookupFva,
  isLoading,
  isFvaLoading,
  lookupSuccess
}: SivTabContentProps) => {
  // Format the license plate as the user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatSivLicensePlate(e.target.value);
    
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
  
  const handleLookupVehicle = () => {
    if (!validateLicensePlate(licensePlate, 'siv')) {
      toast.error("Format d'immatriculation invalide. Utilisez le format AB-123-CD");
      return;
    }
    onLookupVehicle();
  };
  
  const handleLookupFva = () => {
    if (!validateLicensePlate(licensePlate, 'siv')) {
      toast.error("Format d'immatriculation invalide. Utilisez le format AB-123-CD");
      return;
    }
    onLookupFva();
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
            placeholder="AB-123-CD"
            className="pr-12"
            maxLength={9}
            required
          />
          <LookupButton 
            isLoading={isLoading}
            lookupSuccess={lookupSuccess}
            onClick={handleLookupVehicle}
            tooltip="Consulter le SIV (Système d'Immatriculation des Véhicules)"
          />
        </div>
      </div>
      
      <div className="flex justify-end mb-2">
        <ActionButton
          isLoading={isFvaLoading}
          onClick={handleLookupFva}
          disabled={!licensePlate}
          Icon={FileSearch}
          label="Consulter le Fichier des Véhicules Assurés (FVA)"
          variant="default"
          tooltip="Consulter le FVA pour obtenir les informations complètes du véhicule et de son assurance"
        />
      </div>
      
      <p className="text-xs text-constalib-dark-gray">
        Format du SIV (post-2009): AB-123-CD. Utilisez le bouton "Consulter le FVA" pour obtenir les informations complètes du véhicule et de son assurance.
      </p>
    </div>
  );
};

export default SivTabContent;
