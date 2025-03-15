
import Header from '@/components/Header';
import AccidentForm from '@/components/AccidentForm';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import EmergencyServicesDrawer from '@/components/accident/EmergencyServicesDrawer';

const Accident = () => {
  const [emergencyDrawerOpen, setEmergencyDrawerOpen] = useState(false);

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
              <AlertCircle className="mr-2 h-5 w-5" />
              Appeler les secours
            </Button>
          </div>
          
          <AccidentForm onEmergencyRequest={() => setEmergencyDrawerOpen(true)} />
        </div>
      </main>

      <EmergencyServicesDrawer 
        open={emergencyDrawerOpen} 
        onOpenChange={setEmergencyDrawerOpen} 
        onEmergencyContacted={() => {}}
      />

      <Toaster />
    </div>
  );
};

export default Accident;
