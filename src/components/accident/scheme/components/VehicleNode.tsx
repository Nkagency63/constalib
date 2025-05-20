import React, { useRef } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';

interface VehicleNodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  label?: string;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onRotate: (angle: number) => void;
}

const VehicleNode: React.FC<VehicleNodeProps> = ({
  id,
  x,
  y,
  width,
  height,
  rotation,
  color,
  label = '',
  isSelected,
  isDraggable,
  onSelect,
  onMove,
  onRotate
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      // Attach transformer to the vehicle
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onMove(e.target.x(), e.target.y());
  };

  const handleTransform = (e: Konva.KonvaEventObject<Event>) => {
    if (groupRef.current) {
      // Update rotation after transformer change
      const rotation = groupRef.current.rotation();
      onRotate(rotation);
    }
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={x}
        y={y}
        rotation={rotation}
        draggable={isDraggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
      >
        {/* Vehicle body */}
        <Rect
          width={width}
          height={height}
          fill={color}
          cornerRadius={5}
          shadowBlur={isSelected ? 10 : 5}
          shadowOpacity={isSelected ? 0.3 : 0.2}
          shadowColor="black"
          stroke={isSelected ? "#000" : "transparent"}
          strokeWidth={1}
        />
        
        {/* Windshield - visual element */}
        <Rect
          x={width * 0.15}
          y={height * 0.2}
          width={width * 0.7}
          height={height * 0.25}
          fill="lightblue"
        />
        
        {/* Vehicle label */}
        <Text
          text={label}
          fontSize={14}
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          fill="white"
          width={width}
          height={height}
          offsetY={-height / 2 - 15}  // Position label above vehicle
        />
      </Group>
      
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resizing (keep only rotation)
            return oldBox;
          }}
          enabledAnchors={[]} // Disable resize anchors
        />
      )}
    </>
  );
};

export default VehicleNode;
