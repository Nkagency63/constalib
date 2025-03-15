
import Header from '@/components/Header';
import { Calendar, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

const Appointments = () => {
  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-constalib-dark mb-2">Mes Rendez-vous</h1>
          <p className="text-sm md:text-base text-constalib-dark-gray mb-6 md:mb-8">
            Gérez vos rendez-vous avec les experts et les réparateurs sur Constalib.fr.
          </p>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList>
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="past">Passés</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Prendre rendez-vous
            </Button>
          </div>
          
          {/* Empty state or placeholder for appointments list */}
          <div className="mt-8 text-center p-12 bg-white rounded-lg border border-constalib-light-gray">
            <div className="mx-auto w-12 h-12 rounded-full bg-constalib-light-blue/30 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-constalib-blue" />
            </div>
            <h3 className="text-xl font-semibold text-constalib-dark mb-2">Aucun rendez-vous</h3>
            <p className="text-constalib-dark-gray mb-6">
              Vous n'avez pas encore planifié de rendez-vous dans votre espace personnel.
            </p>
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <Clock className="h-4 w-4" />
              Planifier un rendez-vous
            </Button>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default Appointments;
