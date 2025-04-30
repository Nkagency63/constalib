
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface StepByStepGuideProps {
  vehicleCount: number;
  pathCount: number;
  annotationCount: number;
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({ 
  vehicleCount, 
  pathCount, 
  annotationCount 
}) => {
  const steps = [
    {
      id: 'vehicles',
      title: 'Ajouter les véhicules impliqués',
      description: 'Placez tous les véhicules concernés',
      completed: vehicleCount > 0,
    },
    {
      id: 'position',
      title: 'Positionner les véhicules',
      description: 'Placez-les correctement sur la carte',
      completed: vehicleCount > 0,
    },
    {
      id: 'paths',
      title: 'Tracer les trajectoires',
      description: 'Montrez le déplacement des véhicules',
      completed: pathCount > 0,
    },
    {
      id: 'annotations',
      title: 'Ajouter des annotations',
      description: 'Précisez des détails importants',
      completed: annotationCount > 0,
    }
  ];
  
  return (
    <div className="absolute top-16 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-4 w-64">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1 text-blue-600" />
        Guide étape par étape
      </h3>
      <ul className="space-y-2">
        {steps.map((step) => (
          <li key={step.id} className="flex items-start">
            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
              step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {step.completed ? (
                <Check className="h-3 w-3" />
              ) : (
                <span className="text-xs">{steps.findIndex(s => s.id === step.id) + 1}</span>
              )}
            </div>
            <div className="ml-2">
              <p className={`text-xs font-medium ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepByStepGuide;
