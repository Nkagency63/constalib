
import Header from '@/components/Header';
import AccidentForm from '@/components/AccidentForm';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { AlertCircle, Info, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import EmergencyServicesDrawer from '@/components/accident/EmergencyServicesDrawer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Accident = () => {
  const [emergencyDrawerOpen, setEmergencyDrawerOpen] = useState(false);
  const [emergencyContacted, setEmergencyContacted] = useState(false);
  const [currentStep, setCurrentStep] = useState("basics");
  const [showHelp, setShowHelp] = useState(false);

  const handleEmergencyContacted = () => {
    setEmergencyContacted(true);
  };

  const handleStepChange = (stepId: string) => {
    setCurrentStep(stepId);
    setShowHelp(false); // Reset help visibility on step change
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-constalib-dark mb-2">Déclarer un accident</h1>
              <p className="text-sm md:text-base text-constalib-dark-gray">
                Complétez le formulaire ci-dessous pour déclarer votre accident sur Constalib.fr.
              </p>
            </div>
            
            <div className="flex mt-4 md:mt-0 gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleHelp}
                className="flex items-center" 
                title="Aide"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="destructive" 
                className="flex items-center" 
                onClick={() => setEmergencyDrawerOpen(true)}
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Appeler les secours
              </Button>
            </div>
          </div>
          
          {showHelp && currentStep === "vehicles" && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">Aide pour l'identification des véhicules</AlertTitle>
              <AlertDescription className="text-blue-700 text-sm">
                <p className="mb-2">Pour identifier votre véhicule, vous pouvez utiliser les différentes bases de données disponibles :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>SIV</strong> (Système d'Immatriculation des Véhicules) - Pour les véhicules immatriculés depuis 2009 au format AA-123-BB</li>
                  <li><strong>FNI</strong> (Fichier National des Immatriculations) - Pour les véhicules immatriculés avant 2009 au format 123 ABC 75</li>
                  <li><strong>FVA</strong> (Fichier des Véhicules Assurés) - Contient des informations sur l'assurance de votre véhicule</li>
                </ul>
                <p className="mt-2">Si votre véhicule n'est pas trouvé dans ces bases de données, vous pouvez saisir manuellement les informations.</p>
                <p className="mt-2">Conseil: Vérifiez que vous saisissez correctement votre plaque d'immatriculation, en respectant le format approprié.</p>
              </AlertDescription>
            </Alert>
          )}

          {showHelp && currentStep === "circumstances" && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">Aide pour la sélection des circonstances</AlertTitle>
              <AlertDescription className="text-blue-700 text-sm">
                <p className="mb-2">La sélection des circonstances est une étape importante du constat amiable :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cochez les circonstances qui s'appliquent à <strong>chaque véhicule</strong> séparément</li>
                  <li>Vous pouvez sélectionner <strong>plusieurs circonstances</strong> par véhicule</li>
                  <li>Soyez précis et objectif dans vos sélections</li>
                  <li>Si aucune circonstance ne correspond exactement, choisissez celle qui se rapproche le plus</li>
                </ul>
                <p className="mt-2">Ces informations sont cruciales pour déterminer les responsabilités dans l'accident.</p>
              </AlertDescription>
            </Alert>
          )}
          
          {currentStep === "vehicles" && (
            <Alert variant="default" className="bg-amber-50 border-amber-200 mb-6">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>Nouveau:</strong> Vous pouvez désormais consulter le FNI (Fichier National des Immatriculations) 
                pour les véhicules immatriculés avant 2009, en plus du SIV (Système d'Immatriculation des Véhicules) 
                pour les véhicules récents.
              </AlertDescription>
            </Alert>
          )}
          
          {currentStep === "circumstances" && (
            <Alert variant="default" className="bg-amber-50 border-amber-200 mb-6">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>Nouveau:</strong> La sélection des circonstances permet désormais de choisir précisément les 
                conditions de l'accident pour chaque véhicule. Ces informations seront utilisées dans le constat amiable.
              </AlertDescription>
            </Alert>
          )}
          
          <AccidentForm 
            onEmergencyRequest={() => setEmergencyDrawerOpen(true)} 
            onStepChange={handleStepChange}
          />
        </div>
      </main>

      <EmergencyServicesDrawer 
        open={emergencyDrawerOpen} 
        onOpenChange={setEmergencyDrawerOpen} 
        onEmergencyContacted={handleEmergencyContacted}
      />

      <Toaster />
    </div>
  );
};

export default Accident;
