
import React from 'react';

export interface VehicleNodeProps {
  key: string;
  id?: string;
  vehicle?: any;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onRotate: (angle: number) => void;
  readOnly?: boolean;
  onChange?: (updatedVehicle: any) => void;
  onClick?: () => void;
}

const VehicleNode: React.FC<VehicleNodeProps> = ({
  id,
  vehicle,
  x,
  y,
  width,
  height,
  rotation,
  color = 'blue',
  isSelected,
  isDraggable,
  onSelect,
  onMove,
  onRotate,
  readOnly = false,
  onChange,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (!readOnly) onSelect();
  };

  return (
    <div
      className={`vehicle-node ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        backgroundColor: color,
        border: isSelected ? '2px solid yellow' : '1px solid black',
        cursor: isDraggable ? 'move' : 'pointer'
      }}
      onClick={handleClick}
    >
      {/* Label du véhicule */}
      <div className="vehicle-label" style={{ padding: '2px', textAlign: 'center', fontSize: '12px', color: 'white' }}>
        {vehicle?.label || (id?.includes('a') ? 'A' : 'B')}
      </div>
    </div>
  );
};

export default VehicleNode;
