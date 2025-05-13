
import React from 'react';

interface KeyboardShortcutsProps {
  selectedVehicle: string | null;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ selectedVehicle }) => {
  if (!selectedVehicle) return null;
  
  return (
    <div className="absolute bottom-2 right-2 bg-white/80 p-2 rounded text-xs text-gray-500">
      <p>Raccourcis: Flèches = Rotation | Suppr = Supprimer</p>
    </div>
  );
};

export default KeyboardShortcuts;
