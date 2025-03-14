
import { Check } from 'lucide-react';
import Button from '../Button';

const SuccessMessage = () => {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-constalib-dark mb-4">Déclaration envoyée avec succès !</h2>
      <p className="text-constalib-dark-gray mb-8">
        Votre déclaration d'accident a été transmise. Un conseiller vous contactera prochainement pour vous accompagner dans vos démarches.
      </p>
      <Button onClick={() => window.location.href = '/'}>
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default SuccessMessage;
