
import React, { useState, useMemo } from 'react';
import { CircumstanceCategory, Circumstance } from './types';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';

interface CircumstanceStepProps {
  circumstances: string[];
  vehicleACircumstances: string[];
  vehicleBCircumstances: string[];
  handleCircumstanceChange: (vehicleId: 'A' | 'B', circumstanceId: string, isChecked: boolean) => void;
  currentVehicleId: 'A' | 'B';
  setCurrentVehicleId: (vehicleId: 'A' | 'B') => void;
}

const CircumstanceStep: React.FC<CircumstanceStepProps> = ({
  vehicleACircumstances,
  vehicleBCircumstances,
  handleCircumstanceChange,
  currentVehicleId,
  setCurrentVehicleId
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const circumstanceCategories: CircumstanceCategory[] = useMemo(() => [
    {
      id: 'parking',
      title: 'Stationnement / Arrêt',
      circumstances: [
        { id: 'c1', label: 'En stationnement', description: 'Véhicule garé légalement' },
        { id: 'c2', label: 'Quittait un stationnement', description: 'Véhicule sortant d\'une place de stationnement' },
        { id: 'c3', label: 'Prenait un stationnement', description: 'Véhicule en manœuvre pour se garer' },
        { id: 'c4', label: 'Sortait d\'un parking', description: 'Véhicule sortant d\'un parking, d\'un lieu privé, d\'un chemin de terre' },
      ]
    },
    {
      id: 'maneuvers',
      title: 'Manœuvres',
      circumstances: [
        { id: 'c5', label: 'S\'engageait dans un parking', description: 'Véhicule entrant dans un parking, un lieu privé, un chemin de terre' },
        { id: 'c6', label: 'S\'engageait sur une place à sens giratoire', description: 'Véhicule entrant sur un rond-point' },
        { id: 'c7', label: 'Circulait sur une place à sens giratoire', description: 'Véhicule circulant dans un rond-point' },
        { id: 'c8', label: 'Heurtait à l\'arrière', description: 'Choc à l\'arrière lors d\'une circulation dans le même sens et sur la même file' },
        { id: 'c9', label: 'Roulait dans le même sens sur une autre file', description: 'Véhicules circulant dans le même sens mais sur des files différentes' },
      ]
    },
    {
      id: 'direction',
      title: 'Direction / Changement de voie',
      circumstances: [
        { id: 'c10', label: 'Changeait de file', description: 'Véhicule changeant de file de circulation' },
        { id: 'c11', label: 'Doublait', description: 'Véhicule en train de doubler un autre véhicule' },
        { id: 'c12', label: 'Virait à droite', description: 'Véhicule effectuant un virage à droite' },
        { id: 'c13', label: 'Virait à gauche', description: 'Véhicule effectuant un virage à gauche' },
        { id: 'c14', label: 'Reculait', description: 'Véhicule en marche arrière' },
      ]
    },
    {
      id: 'priority',
      title: 'Priorités / Signalisation',
      circumstances: [
        { id: 'c15', label: 'Empiétait sur une voie réservée', description: 'Véhicule circulant partiellement ou totalement sur une voie réservée à la circulation en sens inverse' },
        { id: 'c16', label: 'Venait de droite', description: 'Véhicule venant de la droite à une intersection' },
        { id: 'c17', label: 'N\'avait pas observé un signal de priorité', description: 'Non-respect d\'un panneau stop, cédez le passage ou feu rouge' },
      ]
    }
  ], []);

  const currentCircumstances = currentVehicleId === 'A' ? vehicleACircumstances : vehicleBCircumstances;

  const handleCircumstanceClick = (circumstanceId: string, isChecked: boolean) => {
    handleCircumstanceChange(currentVehicleId, circumstanceId, isChecked);
    
    const selectedCircumstances = currentVehicleId === 'A' ? vehicleACircumstances : vehicleBCircumstances;
    if (isChecked && selectedCircumstances.length >= 3) {
      toast.warning("Vous ne pouvez pas sélectionner plus de 3 circonstances par véhicule.");
      return;
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return circumstanceCategories;

    return circumstanceCategories.map(category => ({
      ...category,
      circumstances: category.circumstances.filter(circ => 
        circ.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        circ.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.circumstances.length > 0);
  }, [circumstanceCategories, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row mb-6 gap-4 items-center">
        <h3 className="text-lg font-medium">Sélectionner pour le véhicule :</h3>
        <RadioGroup 
          value={currentVehicleId} 
          onValueChange={(value) => setCurrentVehicleId(value as 'A' | 'B')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="A" id="vehicleA" />
            <Label htmlFor="vehicleA" className="font-medium">Véhicule A (votre véhicule)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="B" id="vehicleB" />
            <Label htmlFor="vehicleB" className="font-medium">Véhicule B (autre véhicule)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher une circonstance..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setSearchQuery('')}
            aria-label="Effacer la recherche"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucune circonstance ne correspond à votre recherche.
        </div>
      )}

      {filteredCategories.map((category) => (
        <div key={category.id} className="mb-8">
          <h3 className="text-lg font-medium mb-3">{category.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.circumstances.map((circ) => (
              <div key={circ.id} className="flex items-start space-x-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id={`${currentVehicleId}-${circ.id}`} 
                  checked={currentCircumstances.includes(circ.id)}
                  onCheckedChange={(checked) => {
                    handleCircumstanceClick(circ.id, checked === true);
                  }}
                  className="mt-1"
                />
                <div>
                  <Label 
                    htmlFor={`${currentVehicleId}-${circ.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {circ.label}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">{circ.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Nombre de circonstances sélectionnées :</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <span className="font-semibold">Véhicule A :</span> {vehicleACircumstances.length} circonstance(s)
          </div>
          <div>
            <span className="font-semibold">Véhicule B :</span> {vehicleBCircumstances.length} circonstance(s)
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircumstanceStep;
