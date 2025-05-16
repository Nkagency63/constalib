
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Circumstance } from './types';

interface CircumstancesStepProps {
  formData: any;
  handleCircumstanceChange: (vehicleId: "A" | "B", circumstanceId: string, checked: boolean) => void;
  setCurrentVehicleId: (id: "A" | "B") => void;
  currentVehicleId: "A" | "B";
}

const CircumstancesStep: React.FC<CircumstancesStepProps> = ({
  formData,
  handleCircumstanceChange,
  setCurrentVehicleId,
  currentVehicleId
}) => {
  const circumstancesA = formData.circumstancesA || [];
  const circumstancesB = formData.circumstancesB || [];
  
  // Liste des circonstances pour les deux véhicules
  const commonCircumstances: Circumstance[] = [
    { id: '1', code: '1', label: 'En stationnement', selected: false },
    { id: '2', code: '2', label: 'Quittait un stationnement', selected: false },
    { id: '3', code: '3', label: 'Prenait un stationnement', selected: false },
    { id: '4', code: '4', label: 'Sortait d\'un parking, d\'un lieu privé, d\'un chemin de terre', selected: false },
    { id: '5', code: '5', label: 'S\'engageait dans un parking, un lieu privé, un chemin de terre', selected: false },
    { id: '6', code: '6', label: 'S\'engageait sur une place à sens giratoire', selected: false },
    { id: '7', code: '7', label: 'Roulait sur une place à sens giratoire', selected: false },
    { id: '8', code: '8', label: 'Heurtait à l\'arrière, en roulant dans le même sens et sur une même file', selected: false },
    { id: '9', code: '9', label: 'Roulait dans le même sens et sur une file différente', selected: false },
    { id: '10', code: '10', label: 'Changeait de file', selected: false },
    { id: '11', code: '11', label: 'Doublait', selected: false },
    { id: '12', code: '12', label: 'Virait à droite', selected: false },
    { id: '13', code: '13', label: 'Virait à gauche', selected: false },
    { id: '14', code: '14', label: 'Reculait', selected: false },
    { id: '15', code: '15', label: 'Empiétait sur une voie réservée à la circulation en sens inverse', selected: false },
    { id: '16', code: '16', label: 'Venait de droite (à un carrefour)', selected: false },
    { id: '17', code: '17', label: 'N\'avait pas observé un signal de priorité ou un feu rouge', selected: false }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="A" onValueChange={(value) => setCurrentVehicleId(value as "A" | "B")}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="A">Véhicule A (Votre véhicule)</TabsTrigger>
          <TabsTrigger value="B">Véhicule B</TabsTrigger>
        </TabsList>

        <TabsContent value="A" className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Circonstances pour le véhicule A</h3>
            <div className="grid gap-4">
              {circumstancesA.map((circumstance: Circumstance) => (
                <div key={circumstance.id} className="flex items-start space-x-3">
                  <Checkbox 
                    id={`a-${circumstance.id}`} 
                    checked={circumstance.selected} 
                    onCheckedChange={(checked) => 
                      handleCircumstanceChange("A", circumstance.id, Boolean(checked))
                    }
                  />
                  <label 
                    htmlFor={`a-${circumstance.id}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {circumstance.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="B" className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Circonstances pour le véhicule B</h3>
            <div className="grid gap-4">
              {circumstancesB.map((circumstance: Circumstance) => (
                <div key={circumstance.id} className="flex items-start space-x-3">
                  <Checkbox 
                    id={`b-${circumstance.id}`} 
                    checked={circumstance.selected} 
                    onCheckedChange={(checked) => 
                      handleCircumstanceChange("B", circumstance.id, Boolean(checked))
                    }
                  />
                  <label 
                    htmlFor={`b-${circumstance.id}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {circumstance.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-amber-800">
          Les circonstances marquées sont utilisées pour aider à déterminer la responsabilité. 
          Veuillez sélectionner toutes celles qui s'appliquent à chaque véhicule.
        </p>
      </div>
    </div>
  );
};

export default CircumstancesStep;
