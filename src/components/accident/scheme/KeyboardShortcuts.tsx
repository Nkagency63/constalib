
import React from 'react';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  selectedVehicle: string | null;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ selectedVehicle }) => {
  if (!selectedVehicle) return null;
  
  return (
    <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-3">
      <h3 className="text-xs font-medium mb-1 flex items-center">
        <Keyboard className="h-3 w-3 mr-1 text-blue-600" />
        Raccourcis clavier
      </h3>
      <ul className="text-xs text-gray-600 space-y-1">
        <li className="flex items-center">
          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 mr-2">←→</span>
          <span>Rotation</span>
        </li>
        <li className="flex items-center">
          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 mr-2">Suppr</span>
          <span>Supprimer</span>
        </li>
        <li className="flex items-center">
          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 mr-2">Échap</span>
          <span>Désélectionner</span>
        </li>
      </ul>
    </div>
  );
};

export default KeyboardShortcuts;
