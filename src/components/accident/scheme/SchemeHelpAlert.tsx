
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const SchemeHelpAlert = () => {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 text-sm">
        Utilisez les outils pour ajouter des véhicules, des annotations et des trajectoires. 
        Sélectionnez un élément pour le modifier ou le supprimer.
      </AlertDescription>
    </Alert>
  );
};

export default SchemeHelpAlert;
