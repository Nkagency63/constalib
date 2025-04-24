
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DetailsStepProps {
  description: string;
  hasInjuries: boolean;
  hasWitnesses: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  description,
  hasInjuries,
  hasWitnesses,
  handleInputChange,
  handleCheckboxChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {hasInjuries && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous avez indiqué qu'il y a des blessés. Si ce n'est pas déjà fait, contactez immédiatement les services d'urgence.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasInjuries"
              checked={hasInjuries}
              onCheckedChange={(checked) => handleCheckboxChange('hasInjuries', checked === true)}
            />
            <Label htmlFor="hasInjuries">Y a-t-il des blessés (même légers) ?</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasWitnesses"
              checked={hasWitnesses}
              onCheckedChange={(checked) => handleCheckboxChange('hasWitnesses', checked === true)}
            />
            <Label htmlFor="hasWitnesses">Y a-t-il des témoins ?</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description détaillée de l'accident</Label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            className="w-full h-32 p-2 border border-gray-300 rounded-md"
            placeholder="Décrivez les circonstances de l'accident..."
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
