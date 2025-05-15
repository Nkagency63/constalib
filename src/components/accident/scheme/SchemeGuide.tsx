
import React from 'react';

interface SchemeGuideProps {
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  isEmpty: boolean;
}

const SchemeGuide: React.FC<SchemeGuideProps> = ({ currentTool, isEmpty }) => {
  // Si le schéma n'est pas vide, ne pas afficher le guide
  if (!isEmpty) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/80 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Créez votre schéma d'accident</h3>
      
      {currentTool === 'select' && (
        <p className="text-sm text-gray-700">
          Utilisez l'outil "Véhicule" pour ajouter votre premier véhicule. 
          Cliquez ensuite sur la carte pour le positionner.
        </p>
      )}
      
      {currentTool === 'vehicle' && (
        <p className="text-sm text-gray-700">
          Cliquez maintenant sur la carte pour placer votre véhicule.
          Vous pourrez ensuite le déplacer et le faire pivoter.
        </p>
      )}
      
      {currentTool === 'path' && (
        <p className="text-sm text-gray-700">
          Ajoutez d'abord un véhicule avant de tracer sa trajectoire.
          Utilisez l'outil "Véhicule" pour commencer.
        </p>
      )}
      
      {currentTool === 'annotation' && (
        <p className="text-sm text-gray-700">
          Ajoutez d'abord les éléments principaux de votre schéma.
          Utilisez l'outil "Véhicule" pour commencer.
        </p>
      )}
    </div>
  );
};

export default SchemeGuide;
