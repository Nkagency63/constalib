
import React from 'react';
import { Info } from 'lucide-react';

const Instructions = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 space-y-2">
          <p className="font-medium">Instructions pour le schéma de l'accident :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Cliquez sur "Ajouter véhicule" pour ajouter des véhicules à la scène</li>
            <li>Glissez-déposez les véhicules pour les positionner</li>
            <li>Sélectionnez un véhicule pour afficher ses contrôles de rotation et de suppression</li>
            <li>Utilisez les boutons d'annulation/rétablissement pour corriger des erreurs</li>
            <li>Ajustez le zoom pour mieux voir les détails</li>
          </ul>
          <p>Essayez de représenter la situation le plus fidèlement possible pour faciliter l'analyse de l'accident.</p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
