
import Header from '@/components/Header';
import AccidentForm from '@/components/AccidentForm';
import { Toaster } from "@/components/ui/toaster";

const Accident = () => {
  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-constalib-dark mb-2">Déclarer un accident</h1>
          <p className="text-sm md:text-base text-constalib-dark-gray mb-6 md:mb-8">
            Complétez le formulaire ci-dessous pour déclarer votre accident sur Constalib.fr. Les informations seront envoyées directement à votre assureur.
          </p>
          
          <AccidentForm />
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default Accident;
