import React from 'react';

export interface VehicleNodeProps {
  key: string;
  vehicle: any;
  isSelected: boolean;
  onChange: (updatedVehicle: any) => void;
  onClick: () => void;
  readOnly: boolean;
}

const VehicleNode: React.FC<VehicleNodeProps> = ({
  vehicle,
  isSelected,
  onChange,
  onClick,
  readOnly
}) => {
  // Contenu du composant VehicleNode
  return (
    <div
      className={`vehicle-node ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {/* Contenu du nœud de véhicule */}
      <div>Vehicle: {vehicle.label || 'Unnamed'}</div>
    </div>
  );
};

export default VehicleNode;
