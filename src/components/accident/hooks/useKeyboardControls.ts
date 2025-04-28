
import { useEffect } from 'react';

interface KeyboardControlsProps {
  selectedVehicle: string | null;
  readOnly: boolean;
  onRotateVehicle: (id: string, degrees: number) => void;
  onRemoveVehicle: (id: string) => void;
}

export const useKeyboardControls = ({
  selectedVehicle,
  readOnly,
  onRotateVehicle,
  onRemoveVehicle
}: KeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readOnly || !selectedVehicle) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          onRotateVehicle(selectedVehicle, -45);
          break;
        case 'ArrowRight':
          onRotateVehicle(selectedVehicle, 45);
          break;
        case 'Delete':
        case 'Backspace':
          onRemoveVehicle(selectedVehicle);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVehicle, readOnly, onRotateVehicle, onRemoveVehicle]);
};
