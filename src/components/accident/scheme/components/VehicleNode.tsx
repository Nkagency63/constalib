
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

  // Convertir les coordonnées pour être compatibles avec le nouveau système
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || !isDraggable) return;
    
    // Cette fonction ne déclenche pas réellement le drag, 
    // mais elle peut être utilisée pour des traitements supplémentaires
    console.log("Drag initiated on vehicle", id);
  };

  return (
    <div
      className={`vehicle-node ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${x - width / 2}px`,
        top: `${y - height / 2}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        backgroundColor: color,
        border: isSelected ? '2px solid yellow' : '1px solid black',
        cursor: isDraggable ? 'move' : 'pointer',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'box-shadow 0.2s ease',
        boxShadow: isSelected ? '0 0 0 2px yellow, 0 0 10px rgba(0,0,0,0.3)' : 'none',
        transformOrigin: 'center center',
        zIndex: isSelected ? 100 : 10
      }}
      onClick={handleClick}
      onMouseDown={handleDrag}
    >
      {/* Label du véhicule */}
      {vehicle?.label || (id?.includes('a') ? 'A' : 'B')}
    </div>
  );
};

export default VehicleNode;
