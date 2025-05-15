import React from 'react';
import { WitnessInfo } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export interface DetailsStepProps {
  hasInjuries: boolean;
  injuriesDescription: string;
  hasWitnesses: boolean;
  witnesses: WitnessInfo[];
  description: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setHasInjuries?: (hasInjuries: boolean) => void;
  setInjuriesDescription?: (description: string) => void;
  setHasWitnesses?: (hasWitnesses: boolean) => void;
  updateWitness?: (index: number, field: keyof WitnessInfo, value: string) => void;
  addWitness?: () => void;
  removeWitness?: (index: number) => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  hasInjuries,
  injuriesDescription,
  hasWitnesses,
  witnesses,
  description,
  handleInputChange,
  setHasInjuries = () => {},
  setInjuriesDescription = () => {},
  setHasWitnesses = () => {},
  updateWitness = () => {},
  addWitness = () => {},
  removeWitness = () => {},
}) => {
  const handleInjuriesToggle = (checked: boolean) => {
    setHasInjuries(checked);
  };

  const handleWitnessesToggle = (checked: boolean) => {
    setHasWitnesses(checked);
  };

  const handleInjuriesDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInjuriesDescription(e.target.value);
  };

  const handleWitnessChange = (index: number, field: keyof WitnessInfo, value: string) => {
    updateWitness(index, field, value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="injuries"
            checked={hasInjuries}
            onCheckedChange={handleInjuriesToggle}
          />
          <Label htmlFor="injuries" className="font-medium">
            Y a-t-il des blessés ?
          </Label>
        </div>

        {hasInjuries && (
          <div className="pl-6 border-l-2 border-gray-200">
            <Label htmlFor="injuries-description" className="block mb-2">
              Description des blessures
            </Label>
            <Textarea
              id="injuries-description"
              value={injuriesDescription}
              onChange={handleInjuriesDescriptionChange}
              placeholder="Décrivez les blessures et les personnes concernées"
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="witnesses"
            checked={hasWitnesses}
            onCheckedChange={handleWitnessesToggle}
          />
          <Label htmlFor="witnesses" className="font-medium">
            Y a-t-il des témoins ?
          </Label>
        </div>

        {hasWitnesses && (
          <div className="pl-6 border-l-2 border-gray-200 space-y-4">
            {witnesses.map((witness, index) => (
              <Card key={witness.id || index} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeWitness(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`witness-${index}-name`}>Nom et prénom</Label>
                      <Input
                        id={`witness-${index}-name`}
                        value={witness.name}
                        onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                        placeholder="Nom et prénom du témoin"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`witness-${index}-phone`}>Téléphone</Label>
                      <Input
                        id={`witness-${index}-phone`}
                        value={witness.phone}
                        onChange={(e) => handleWitnessChange(index, 'phone', e.target.value)}
                        placeholder="Numéro de téléphone"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`witness-${index}-address`}>Adresse</Label>
                      <Input
                        id={`witness-${index}-address`}
                        value={witness.address}
                        onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                        placeholder="Adresse complète"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`witness-${index}-email`}>Email</Label>
                      <Input
                        id={`witness-${index}-email`}
                        value={witness.email}
                        onChange={(e) => handleWitnessChange(index, 'email', e.target.value)}
                        placeholder="Adresse email"
                        type="email"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={addWitness}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un témoin
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accident-description" className="font-medium">
          Description de l'accident
        </Label>
        <Textarea
          id="accident-description"
          name="description"
          value={description}
          onChange={(e) => handleInputChange(e as any)}
          placeholder="Décrivez brièvement les circonstances de l'accident"
          className="w-full"
          rows={4}
        />
      </div>
    </div>
  );
};

export default DetailsStep;
