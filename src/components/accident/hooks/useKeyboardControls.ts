
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
    if (readOnly || !selectedVehicle) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onRotateVehicle(selectedVehicle, -45);
      if (e.key === 'ArrowRight') onRotateVehicle(selectedVehicle, 45);
      if (e.key === 'Delete' || e.key === 'Backspace') onRemoveVehicle(selectedVehicle);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVehicle, readOnly, onRotateVehicle, onRemoveVehicle]);
};
