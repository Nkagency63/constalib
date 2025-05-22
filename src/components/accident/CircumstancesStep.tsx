
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Car, CarTaxiFront } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CircumstancesStepProps {
  circumstancesA: number[];
  circumstancesB: number[];
  observations: string;
  disagreement: boolean;
  toggleCircumstance: (index: number, party: 'A' | 'B') => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CIRCUMSTANCES = [
  "en stationnement",
  "quittait un stationnement",
  "prenait un stationnement",
  "sortait d'un parking, d'un lieu privé, d'un chemin de terre",
  "s'engageait dans un parking, un lieu privé, un chemin de terre",
  "s'engageait sur une place à sens giratoire",
  "roulait sur une place à sens giratoire",
  "heurtait à l'arrière, en roulant dans le même sens et sur la même file",
  "roulait dans le même sens et sur une file différente",
  "changeait de file",
  "doublait",
  "virait à droite",
  "virait à gauche",
  "reculait",
  "empiétait sur une voie réservée à la circulation en sens inverse",
  "venait de droite (dans un carrefour)",
  "avait négligé un signal de priorité ou un feu rouge"
];

const CircumstancesStep = ({
  circumstancesA,
  circumstancesB,
  observations,
  disagreement,
  toggleCircumstance,
  handleInputChange
}: CircumstancesStepProps) => {
  const [activeTab, setActiveTab] = useState("vehicle-a");

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
  };

  const handleDisagreementChange = (checked: boolean) => {
    const syntheticEvent = {
      target: {
        name: 'disagreement',
        value: checked.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };

  return (
    <div className="space-y-6">
      <Alert variant="info" className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 text-sm">
          Cochez les circonstances qui s'appliquent à chaque véhicule. 
          Ces cases correspondent à celles du formulaire CERFA officiel.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="vehicle-a" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            Véhicule A (Vous)
          </TabsTrigger>
          <TabsTrigger value="vehicle-b" className="flex items-center">
            <CarTaxiFront className="mr-2 h-4 w-4" />
            Véhicule B (Autre)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicle-a">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {CIRCUMSTANCES.map((circumstance, index) => (
                  <div key={`a-${index}`} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`circumstance-a-${index}`}
                      checked={circumstancesA.includes(index)}
                      onCheckedChange={() => toggleCircumstance(index, 'A')}
                    />
                    <Label 
                      htmlFor={`circumstance-a-${index}`}
                      className="text-sm leading-tight font-normal"
                    >
                      {index + 1}. Le véhicule était {circumstance}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicle-b">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {CIRCUMSTANCES.map((circumstance, index) => (
                  <div key={`b-${index}`} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`circumstance-b-${index}`}
                      checked={circumstancesB.includes(index)}
                      onCheckedChange={() => toggleCircumstance(index, 'B')}
                    />
                    <Label 
                      htmlFor={`circumstance-b-${index}`}
                      className="text-sm leading-tight font-normal"
                    >
                      {index + 1}. Le véhicule était {circumstance}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="observations" className="font-medium">
            Observations complémentaires
          </Label>
          <Textarea
            id="observations"
            name="observations"
            value={observations}
            onChange={handleObservationsChange}
            placeholder="Précisez les circonstances, remarques ou désaccords éventuels..."
            rows={4}
          />
        </div>
        
        <div className="flex items-center space-x-2 p-4 border rounded-lg">
          <Switch 
            id="disagreement"
            checked={disagreement}
            onCheckedChange={handleDisagreementChange}
          />
          <Label htmlFor="disagreement" className="font-medium">
            Signaler un désaccord sur les circonstances
          </Label>
        </div>
      </div>
    </div>
  );
};

export default CircumstancesStep;
