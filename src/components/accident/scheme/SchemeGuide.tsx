
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SchemeGuideProps {
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  isEmpty: boolean;
}

const SchemeGuide: React.FC<SchemeGuideProps> = ({ currentTool, isEmpty }) => {
  // Déterminer le message d'instructions en fonction de l'outil actif
  const getToolInstructions = () => {
    if (isEmpty) {
      return {
        title: "Commencez par ajouter un véhicule",
        description: "Utilisez l'outil véhicule pour ajouter votre premier véhicule sur le schéma",
        icon: <Info className="h-4 w-4 text-blue-600" />
      };
    }
    
    switch (currentTool) {
      case 'select':
        return {
          title: "Mode sélection",
          description: "Cliquez sur un véhicule pour le sélectionner. Vous pourrez alors le déplacer, le pivoter ou le supprimer.",
          icon: <Info className="h-4 w-4 text-blue-600" />
        };
      case 'vehicle':
        return {
          title: "Mode véhicule",
          description: "Cliquez sur la carte pour ajouter un véhicule à cet endroit. Vous pouvez changer le type de véhicule dans la barre d'outils.",
          icon: <Info className="h-4 w-4 text-blue-600" />
        };
      case 'path':
        return {
          title: "Mode trajectoire",
          description: "Cliquez plusieurs fois sur la carte pour tracer une trajectoire. Sélectionnez d'abord un véhicule pour associer la trajectoire à ce véhicule.",
          icon: <Info className="h-4 w-4 text-blue-600" />
        };
      case 'annotation':
        return {
          title: "Mode annotation",
          description: "Cliquez sur la carte pour ajouter une note à cet endroit. Vous pourrez ensuite éditer le texte de cette note.",
          icon: <Info className="h-4 w-4 text-blue-600" />
        };
      default:
        return {
          title: "Création du schéma d'accident",
          description: "Utilisez les outils dans la barre latérale pour ajouter des éléments au schéma.",
          icon: <Info className="h-4 w-4 text-blue-600" />
        };
    }
  };
  
  const instructions = getToolInstructions();
  
  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 w-5/6 max-w-md">
      <Alert className="bg-white/90 backdrop-blur-sm border border-blue-100 shadow-md">
        {instructions.icon}
        <div className="ml-2">
          <Badge variant="outline" className="mb-1 bg-blue-50 text-blue-700 border-blue-200">
            {instructions.title}
          </Badge>
          <AlertDescription className="text-blue-800 text-sm">
            {instructions.description}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};

export default SchemeGuide;
