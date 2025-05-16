
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface WitnessStepProps {
  formData: any;
  setHasWitnesses: (hasWitnesses: boolean) => void;
  updateWitness: (index: number, field: string, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
}

const WitnessStep: React.FC<WitnessStepProps> = ({
  formData,
  setHasWitnesses,
  updateWitness,
  addWitness,
  removeWitness
}) => {
  const hasWitnesses = formData.hasWitnesses || false;
  const witnesses = formData.witnesses || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Switch 
          id="hasWitnesses" 
          checked={hasWitnesses}
          onCheckedChange={setHasWitnesses}
        />
        <Label htmlFor="hasWitnesses">Y a-t-il des témoins de l'accident ?</Label>
      </div>

      {hasWitnesses && (
        <div className="space-y-6">
          {witnesses.map((witness: any, index: number) => (
            <div key={witness.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Témoin {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWitness(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Supprimer le témoin</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`witness-${index}-name`}>Nom et prénom</Label>
                  <Input
                    id={`witness-${index}-name`}
                    value={witness.name}
                    onChange={(e) => updateWitness(index, 'name', e.target.value)}
                    placeholder="Nom et prénom du témoin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`witness-${index}-contact`}>Contact (téléphone ou email)</Label>
                  <Input
                    id={`witness-${index}-contact`}
                    value={witness.contact}
                    onChange={(e) => updateWitness(index, 'contact', e.target.value)}
                    placeholder="Téléphone ou email du témoin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`witness-${index}-address`}>Adresse</Label>
                  <Input
                    id={`witness-${index}-address`}
                    value={witness.address}
                    onChange={(e) => updateWitness(index, 'address', e.target.value)}
                    placeholder="Adresse du témoin"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button 
            type="button" 
            variant="outline" 
            onClick={addWitness}
            className="w-full mt-4"
          >
            Ajouter un témoin
          </Button>
        </div>
      )}

      {!hasWitnesses && (
        <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
          Aucun témoin n'a été ajouté. Si vous avez des témoins, activez l'option ci-dessus.
        </div>
      )}
    </div>
  );
};

export default WitnessStep;
