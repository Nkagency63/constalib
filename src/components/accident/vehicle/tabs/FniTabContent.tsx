
import React from 'react';
import { Input } from "@/components/ui/input";
import { FileText } from 'lucide-react';
import LookupButton from '../buttons/LookupButton';
import ActionButton from '../buttons/ActionButton';
import { formatFniLicensePlate } from '../../utils/licensePlateFormatters';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatFniLicensePlate(e.target.value);
    
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
            placeholder="123 ABC 75"
            className="pr-12"
            maxLength={10}
            required
          />
          <LookupButton 
            isLoading={isFniLoading}
            lookupSuccess={fniLookupSuccess}
            onClick={onLookupFni}
            tooltip="Consulter le FNI (Fichier National des Immatriculations)"
          />
        </div>
        <ActionButton
          isLoading={isFniLoading}
          onClick={onLookupFni}
          disabled={!licensePlate}
          Icon={FileText}
          label="Consulter FNI"
          variant="default"
        />
      </div>
      <p className="text-xs text-constalib-dark-gray">
        Format du FNI (avant 2009): 123 ABC 75 (numéros, lettres, département optionnel). Pour les véhicules immatriculés avant 2009.
      </p>
    </div>
  );
};

export default FniTabContent;
