
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ReviewInfoAlert = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700 text-sm">
        Vous pouvez maintenant enregistrer votre constat officiellement avec l'option e-constat auto,
        qui transmet directement votre déclaration aux services d'assurance concernés pour un traitement accéléré.
      </AlertDescription>
    </Alert>
  );
};

export default ReviewInfoAlert;
