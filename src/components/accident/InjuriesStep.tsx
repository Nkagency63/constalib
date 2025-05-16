
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface InjuriesStepProps {
  formData: any;
  setHasInjuries: (hasInjuries: boolean) => void;
  setInjuriesDescription: (description: string) => void;
}

const InjuriesStep: React.FC<InjuriesStepProps> = ({
  formData,
  setHasInjuries,
  setInjuriesDescription
}) => {
  const hasInjuries = formData.hasInjuries || false;
  const injuriesDescription = formData.injuriesDescription || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Switch 
          id="hasInjuries" 
          checked={hasInjuries}
          onCheckedChange={setHasInjuries}
        />
        <Label htmlFor="hasInjuries">Y a-t-il des blessés dans cet accident ?</Label>
      </div>

      {hasInjuries && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="injuriesDescription">Décrivez les blessures et les personnes concernées</Label>
            <Textarea
              id="injuriesDescription"
              value={injuriesDescription}
              onChange={(e) => setInjuriesDescription(e.target.value)}
              placeholder="Détaillez les personnes blessées et la nature des blessures"
              rows={5}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <p className="text-sm font-medium mb-1">Information importante</p>
            <p className="text-xs">
              Si des personnes sont gravement blessées, assurez-vous que les services d'urgence ont été contactés.
              Cette information sera transmise à votre assurance pour le traitement approprié du dossier.
            </p>
          </div>
        </div>
      )}

      {!hasInjuries && (
        <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
          Aucun blessé n'a été signalé dans cet accident.
        </div>
      )}
    </div>
  );
};

export default InjuriesStep;
