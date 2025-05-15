
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  if (!hasAttemptedLookup) {
    return (
      <Alert className="bg-constalib-blue-50 border-constalib-blue-200">
        <AlertCircle className="h-4 w-4 text-constalib-blue" />
        <AlertTitle className="text-constalib-blue">Utilisation du Fichier des Véhicules Assurés</AlertTitle>
        <AlertDescription className="text-constalib-dark-gray">
          Saisissez votre plaque d'immatriculation et utilisez le bouton "Vérifier FVA" pour récupérer automatiquement les informations du véhicule et de l'assurance depuis le Fichier des Véhicules Assurés.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (lookupSuccess || fniLookupSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Informations du véhicule récupérées avec succès.
          {!fvaLookupSuccess && (
            <span className="block mt-1">
              Vous pouvez également utiliser le bouton "Vérifier FVA" pour récupérer les détails d'assurance complets.
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (fvaLookupSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">FVA - Détails complets récupérés</AlertTitle>
        <AlertDescription className="text-green-800">
          Informations complètes du véhicule et de l'assurance récupérées depuis le Fichier des Véhicules Assurés.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default VehicleHelpText;
