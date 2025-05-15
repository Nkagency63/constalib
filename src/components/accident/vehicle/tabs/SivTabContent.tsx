
import React from 'react';
import { Input } from "@/components/ui/input";
import { Car, UserCheck } from 'lucide-react';
import LookupButton from '../buttons/LookupButton';
import ActionButton from '../buttons/ActionButton';
import { formatSivLicensePlate } from '../../utils/licensePlateFormatters';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatSivLicensePlate(e.target.value);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleLicensePlateChange(syntheticEvent);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
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
            onClick={onLookupVehicle}
            tooltip="Consulter le SIV (Système d'Immatriculation des Véhicules)"
          />
        </div>
        <ActionButton
          isLoading={isFvaLoading}
          onClick={onLookupFva}
          disabled={!licensePlate}
          Icon={UserCheck}
          label="Vérifier FVA"
          variant="outline"
          tooltip="Consulter le FVA (Fichier des Véhicules Assurés)"
        />
      </div>
      <p className="text-xs text-constalib-dark-gray">
        Format du SIV (post-2009): AB-123-CD. Utilisez le bouton "Vérifier FVA" pour consulter le Fichier des Véhicules Assurés.
      </p>
    </div>
  );
};

export default SivTabContent;
