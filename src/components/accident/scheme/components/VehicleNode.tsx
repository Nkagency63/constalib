
import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';

interface VehicleNodeProps {
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
  const shapeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  
  // Sync transformer with the shape when selected
  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
  
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({
      ...vehicle,
      x: e.target.x(),
      y: e.target.y(),
      // Update position for compatibility with existing data structure
      position: [e.target.x(), e.target.y()]
    });
  };
  
  const handleTransformEnd = () => {
    if (!shapeRef.current) return;
    
    // Get the new properties from the transformer
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale to avoid accumulation
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...vehicle,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
      // Update position for compatibility with existing data structure
      position: [node.x(), node.y()]
    });
  };
  
  // Determine color based on vehicle type and selection
  const fillColor = isSelected ? `${vehicle.color}` : `${vehicle.color}`;
  const outlineColor = isSelected ? '#00FF00' : 'black';
  
  return (
    <Group>
      <Rect
        ref={shapeRef}
        x={vehicle.x}
        y={vehicle.y}
        width={vehicle.width}
        height={vehicle.height}
        fill={fillColor}
        stroke={outlineColor}
        strokeWidth={isSelected ? 2 : 1}
        draggable={!readOnly}
        rotation={vehicle.rotation}
        onClick={onClick}
        onTap={onClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        cornerRadius={5}
      />
      
      <Text
        text={vehicle.label || 'Véhicule'}
        x={vehicle.x}
        y={vehicle.y + vehicle.height + 5}
        fontSize={12}
        fill="black"
        width={vehicle.width}
        align="center"
      />
      
      {isSelected && !readOnly && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </Group>
  );
};

export default VehicleNode;
