
export interface Vehicle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  label: string;
}

export interface VehicleIconProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onMouseDown: (vehicleId: string, e: React.MouseEvent) => void;
  onRotate: (vehicleId: string, angle: number) => void;
  onRemove: (vehicleId: string) => void;
}
