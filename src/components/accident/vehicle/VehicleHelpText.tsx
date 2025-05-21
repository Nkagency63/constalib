
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface VehicleHelpTextProps {
  hasAttemptedLookup: boolean;
  lookupSuccess: boolean;
  fniLookupSuccess: boolean;
  fvaLookupSuccess: boolean;
}

const VehicleHelpText = ({ 
  hasAttemptedLookup,
  lookupSuccess,
  fniLookupSuccess,
  fvaLookupSuccess
}: VehicleHelpTextProps) => {
  if (hasAttemptedLookup && !lookupSuccess && !fniLookupSuccess && !fvaLookupSuccess) {
    return (
      <Alert className="mt-4 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800 text-sm">
          <p><strong>Suggestions:</strong></p>
          <ul className="list-disc pl-5 mt-1">
            <li>Vérifiez que vous avez correctement saisi votre plaque d'immatriculation</li>
            <li>Pour les plaques au format SIV (depuis 2009): AA-123-BB</li>
            <li>Pour les plaques au format FNI (avant 2009): 123 ABC 75</li>
            <li>Si vous ne trouvez pas votre véhicule, vous pouvez saisir les informations manuellement</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }
  return null;
};

export default VehicleHelpText;
