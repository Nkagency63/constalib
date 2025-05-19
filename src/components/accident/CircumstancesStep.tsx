
import React from 'react';
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
  // Use the circumstance arrays from formData 
  const vehicleACircumstances = formData.vehicleACircumstances || [];
  const vehicleBCircumstances = formData.vehicleBCircumstances || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue={currentVehicleId} onValueChange={(value) => setCurrentVehicleId(value as "A" | "B")}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="A">Véhicule A (Votre véhicule)</TabsTrigger>
          <TabsTrigger value="B">Véhicule B</TabsTrigger>
        </TabsList>

        <TabsContent value="A" className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Circonstances pour le véhicule A</h3>
            <div className="grid gap-4">
              {vehicleACircumstances.map((circumstance: Circumstance) => (
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
              {vehicleBCircumstances.map((circumstance: Circumstance) => (
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
