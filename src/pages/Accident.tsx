
import Header from '@/components/Header';
import AccidentForm from '@/components/AccidentForm';
import { Toaster } from "@/components/ui/toaster";

const Accident = () => {
  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-constalib-dark mb-2">Déclarer un accident</h1>
          <p className="text-constalib-dark-gray mb-8">
            Complétez le formulaire ci-dessous pour déclarer votre accident. Les informations seront envoyées à votre assureur.
          </p>
          
          <AccidentForm />
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default Accident;
