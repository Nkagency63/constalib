
import { AlertCircle, UserCheck, Bandage } from 'lucide-react';
import { WitnessInfo } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DetailsStepProps {
  description: string;
  hasInjuries: boolean;
  injuriesDescription: string;
  hasWitnesses: boolean;
  witnesses: WitnessInfo[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setHasInjuries: (value: boolean) => void;
  setInjuriesDescription: (value: string) => void;
  setHasWitnesses: (value: boolean) => void;
  updateWitness: (index: number, field: keyof WitnessInfo, value: string) => void;
  addWitness: () => void;
  removeWitness: (index: number) => void;
}

const DetailsStep = ({
  description,
  hasInjuries,
  injuriesDescription,
  hasWitnesses,
  witnesses,
  handleInputChange,
  setHasInjuries,
  setInjuriesDescription,
  setHasWitnesses,
  updateWitness,
  addWitness,
  removeWitness
}: DetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-constalib-dark">
          Description de l'accident
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={handleInputChange}
          rows={6}
          placeholder="Décrivez les circonstances de l'accident..."
          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue resize-none"
          required
        />
        <p className="text-sm text-constalib-dark-gray mt-1">
          Soyez aussi précis que possible. Mentionnez les conditions météorologiques, l'état de la route, etc.
        </p>
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Bandage className="h-5 w-5 text-constalib-blue mt-0.5" />
          <div className="space-y-2 flex-1">
            <h4 className="font-medium text-constalib-dark">Y a-t-il des blessés ?</h4>
            <RadioGroup
              value={hasInjuries ? "yes" : "no"}
              onValueChange={(value) => setHasInjuries(value === "yes")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="injuries-yes" />
                <Label htmlFor="injuries-yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="injuries-no" />
                <Label htmlFor="injuries-no">Non</Label>
              </div>
            </RadioGroup>

            {hasInjuries && (
              <div className="mt-2">
                <textarea
                  value={injuriesDescription}
                  onChange={(e) => setInjuriesDescription(e.target.value)}
                  placeholder="Décrivez les blessures..."
                  className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 border rounded-lg p-4">
        <div className="flex items-start gap-2">
          <UserCheck className="h-5 w-5 text-constalib-blue mt-0.5" />
          <div className="space-y-2 flex-1">
            <h4 className="font-medium text-constalib-dark">Y a-t-il des témoins ?</h4>
            <RadioGroup
              value={hasWitnesses ? "yes" : "no"}
              onValueChange={(value) => setHasWitnesses(value === "yes")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="witnesses-yes" />
                <Label htmlFor="witnesses-yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="witnesses-no" />
                <Label htmlFor="witnesses-no">Non</Label>
              </div>
            </RadioGroup>

            {hasWitnesses && (
              <div className="mt-4 space-y-4">
                {witnesses.map((witness, index) => (
                  <div key={index} className="space-y-2 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Témoin {index + 1}</h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWitness(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <div>
                        <Label htmlFor={`witness-name-${index}`}>Nom complet</Label>
                        <Input
                          id={`witness-name-${index}`}
                          value={witness.fullName}
                          onChange={(e) => updateWitness(index, 'fullName', e.target.value)}
                          placeholder="Nom et prénom"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`witness-phone-${index}`}>Téléphone</Label>
                        <Input
                          id={`witness-phone-${index}`}
                          value={witness.phone}
                          onChange={(e) => updateWitness(index, 'phone', e.target.value)}
                          placeholder="Numéro de téléphone"
                          type="tel"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`witness-email-${index}`}>Email</Label>
                        <Input
                          id={`witness-email-${index}`}
                          value={witness.email}
                          onChange={(e) => updateWitness(index, 'email', e.target.value)}
                          placeholder="Adresse email"
                          type="email"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addWitness}
                  variant="outline"
                  className="w-full"
                >
                  Ajouter un témoin
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-constalib-light-blue p-4 rounded-lg flex items-start space-x-3">
        <AlertCircle className="text-constalib-blue flex-shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-constalib-blue font-medium">Conseil</h4>
          <p className="text-sm text-constalib-dark-gray">
            N'admettez pas de responsabilité dans votre description. Contentez-vous de décrire objectivement les faits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
