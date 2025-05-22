
import { Calendar, Cloud, User, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Witness } from './types';

interface BasicInfoStepProps {
  date: string;
  time: string;
  weatherConditions: string;
  injuredPersons: boolean;
  witnesses: Witness[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onWeatherChange: (value: string) => void;
  onInjuredPersonsChange: (value: boolean) => void;
  addWitness: () => void;
  updateWitness: (id: string, field: keyof Witness, value: string) => void;
  removeWitness: (id: string) => void;
}

const BasicInfoStep = ({ 
  date, 
  time, 
  weatherConditions,
  injuredPersons,
  witnesses,
  handleInputChange, 
  onWeatherChange,
  onInjuredPersonsChange,
  addWitness,
  updateWitness,
  removeWitness
}: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-constalib-dark">
          Date de l'accident
        </label>
        <div className="relative">
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
            required
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="time" className="block text-sm font-medium text-constalib-dark">
          Heure de l'accident
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={time}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="weatherConditions" className="block text-sm font-medium text-constalib-dark">
          Conditions météo
        </label>
        <div className="relative">
          <Select 
            value={weatherConditions} 
            onValueChange={onWeatherChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez les conditions météo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Conditions normales</SelectItem>
              <SelectItem value="rain">Pluie</SelectItem>
              <SelectItem value="snow">Neige</SelectItem>
              <SelectItem value="fog">Brouillard</SelectItem>
              <SelectItem value="ice">Verglas</SelectItem>
              <SelectItem value="wind">Vent fort</SelectItem>
              <SelectItem value="night">Nuit</SelectItem>
            </SelectContent>
          </Select>
          <Cloud className="absolute right-10 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="injured-persons" 
          checked={injuredPersons}
          onCheckedChange={onInjuredPersonsChange}
        />
        <Label htmlFor="injured-persons" className="font-medium text-constalib-dark">
          Y a-t-il des blessés ?
        </Label>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-constalib-dark flex items-center">
            <Users className="mr-2" size={20} />
            Témoins (facultatif)
          </h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addWitness}
          >
            Ajouter un témoin
          </Button>
        </div>
        
        {witnesses.length === 0 && (
          <p className="text-sm text-constalib-dark-gray">
            Aucun témoin ajouté. Cliquez sur "Ajouter un témoin" si nécessaire.
          </p>
        )}
        
        {witnesses.map((witness) => (
          <div key={witness.id} className="border border-constalib-gray p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-constalib-dark flex items-center">
                <User className="mr-2" size={16} />
                Témoin
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeWitness(witness.id)}
              >
                Retirer
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`witness-name-${witness.id}`} className="text-sm font-medium">
                  Nom et prénom
                </Label>
                <Input 
                  id={`witness-name-${witness.id}`}
                  value={witness.name}
                  onChange={(e) => updateWitness(witness.id, 'name', e.target.value)}
                  placeholder="Nom et prénom du témoin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`witness-contact-${witness.id}`} className="text-sm font-medium">
                  Coordonnées (téléphone, email, adresse)
                </Label>
                <Input 
                  id={`witness-contact-${witness.id}`}
                  value={witness.contact}
                  onChange={(e) => updateWitness(witness.id, 'contact', e.target.value)}
                  placeholder="Coordonnées du témoin"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicInfoStep;
