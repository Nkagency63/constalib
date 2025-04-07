
import Header from '@/components/Header';
import AccidentForm from '@/components/AccidentForm';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import EmergencyServicesDrawer from '@/components/accident/EmergencyServicesDrawer';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Accident = () => {
  const [emergencyDrawerOpen, setEmergencyDrawerOpen] = useState(false);
  const [emergencyContacted, setEmergencyContacted] = useState(false);
  const [currentStep, setCurrentStep] = useState("basics");

  const handleEmergencyContacted = () => {
    setEmergencyContacted(true);
  };

  const handleStepChange = (stepId: string) => {
    setCurrentStep(stepId);
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
            
            <Button 
              variant="destructive" 
              className="mt-4 md:mt-0 flex items-center" 
              onClick={() => setEmergencyDrawerOpen(true)}
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Appeler les secours
            </Button>
          </div>
          
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
