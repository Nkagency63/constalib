
import React, { useState, useMemo } from 'react';
import { CircumstanceCategory, Circumstance } from './types';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
    const selectedCircumstances = currentVehicleId === 'A' ? vehicleACircumstances : vehicleBCircumstances;
    
    if (isChecked && selectedCircumstances.length >= 3) {
      toast.warning("Vous ne pouvez pas sélectionner plus de 3 circonstances par véhicule.");
      return;
    }
    
    handleCircumstanceChange(currentVehicleId, circumstanceId, isChecked);
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
    <div className="space-y-6 bg-white">
      {/* Header with blue background - similar to e-constat */}
      <div className="bg-[#1a3b8e] text-white p-4 rounded-t-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold text-center">CIRCONSTANCES</h2>
        <p className="text-center text-sm opacity-90">
          Cochez les cases utiles pour préciser le croquis et les circonstances
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row mb-6 gap-4 items-center">
        <h3 className="text-lg font-medium">Sélectionner pour le véhicule :</h3>
        <div className="flex w-full md:w-auto gap-4 justify-center">
          <div 
            className={cn(
              "flex-1 md:flex-initial cursor-pointer rounded-md px-5 py-3 text-center font-bold border-2 flex flex-col items-center justify-center gap-1",
              currentVehicleId === 'A' 
                ? "border-[#1a3b8e] bg-[#e6ebf7] text-[#1a3b8e]" 
                : "border-gray-300 bg-white text-gray-500"
            )}
            onClick={() => setCurrentVehicleId('A')}
          >
            <span className="text-2xl">A</span>
            <span className="text-xs">VOTRE VÉHICULE</span>
          </div>
          
          <div 
            className={cn(
              "flex-1 md:flex-initial cursor-pointer rounded-md px-5 py-3 text-center font-bold border-2 flex flex-col items-center justify-center gap-1",
              currentVehicleId === 'B' 
                ? "border-[#d04a35] bg-[#f9e9e7] text-[#d04a35]" 
                : "border-gray-300 bg-white text-gray-500"
            )}
            onClick={() => setCurrentVehicleId('B')}
          >
            <span className="text-2xl">B</span>
            <span className="text-xs">AUTRE VÉHICULE</span>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher une circonstance..."
          className="pl-10 pr-10 border-[#1a3b8e]"
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

      <div className="grid grid-cols-1 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="border border-[#1a3b8e] rounded-lg overflow-hidden">
            <div className="bg-[#1a3b8e] text-white p-3 font-semibold">
              {category.title}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
              {category.circumstances.map((circ) => (
                <div 
                  key={circ.id} 
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-md transition-colors",
                    currentCircumstances.includes(circ.id) 
                      ? currentVehicleId === 'A'
                        ? "bg-[#e6ebf7] border border-[#1a3b8e]" 
                        : "bg-[#f9e9e7] border border-[#d04a35]"
                      : "border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <Checkbox 
                    id={`${currentVehicleId}-${circ.id}`} 
                    checked={currentCircumstances.includes(circ.id)}
                    onCheckedChange={(checked) => {
                      handleCircumstanceClick(circ.id, checked === true);
                    }}
                    className={cn(
                      "mt-1", 
                      currentVehicleId === 'A' ? "text-[#1a3b8e]" : "text-[#d04a35]"
                    )}
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
      </div>

      <div className="mt-6 p-4 rounded-md flex flex-col md:flex-row gap-4 border-2 border-[#1a3b8e]">
        <div className={cn(
          "flex-1 p-3 rounded-md", 
          vehicleACircumstances.length > 0 ? "bg-[#e6ebf7]" : "bg-gray-50"
        )}>
          <h4 className="font-bold text-[#1a3b8e] mb-2">VÉHICULE A</h4>
          <p className="text-[#1a3b8e] font-semibold">{vehicleACircumstances.length} circonstance(s) sélectionnée(s)</p>
          <ul className="mt-2 space-y-1">
            {vehicleACircumstances.map(id => {
              const circ = circumstanceCategories
                .flatMap(cat => cat.circumstances)
                .find(c => c.id === id);
              return circ ? (
                <li key={id} className="text-sm">• {circ.label}</li>
              ) : null;
            })}
          </ul>
        </div>
        
        <div className={cn(
          "flex-1 p-3 rounded-md",
          vehicleBCircumstances.length > 0 ? "bg-[#f9e9e7]" : "bg-gray-50"
        )}>
          <h4 className="font-bold text-[#d04a35] mb-2">VÉHICULE B</h4>
          <p className="text-[#d04a35] font-semibold">{vehicleBCircumstances.length} circonstance(s) sélectionnée(s)</p>
          <ul className="mt-2 space-y-1">
            {vehicleBCircumstances.map(id => {
              const circ = circumstanceCategories
                .flatMap(cat => cat.circumstances)
                .find(c => c.id === id);
              return circ ? (
                <li key={id} className="text-sm">• {circ.label}</li>
              ) : null;
            })}
          </ul>
        </div>
      </div>
      
      <div className="p-4 bg-[#f7f9fc] rounded-md border border-gray-200 mt-6">
        <p className="text-sm text-gray-600 italic">
          <span className="font-semibold">Note :</span> Cochez jusqu'à 3 circonstances par véhicule. 
          Les circonstances sont utilisées pour déterminer les responsabilités dans l'accident.
        </p>
      </div>
    </div>
  );
};

export default CircumstanceStep;
