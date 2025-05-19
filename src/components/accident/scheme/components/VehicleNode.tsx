
import { useRef, useEffect } from 'react';
import { Group, Rect, Transformer } from 'react-konva';
import Konva from 'konva';

interface VehicleNodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onRotate: (angle: number) => void;
}

const VehicleNode = ({
  id,
  x,
  y,
  width,
  height,
  rotation,
  color,
  isSelected,
  isDraggable,
  onSelect,
  onMove,
  onRotate
}: VehicleNodeProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      // Attach transformer to the group
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
  
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
        onDragEnd={(e) => {
          onMove(e.target.x(), e.target.y());
        }}
        onTransformEnd={() => {
          if (groupRef.current) {
            const rotation = groupRef.current.rotation();
            onRotate(rotation);
          }
        }}
      >
        <Rect
          width={width}
          height={height}
          fill={color}
          opacity={0.7}
          cornerRadius={5}
          offsetX={width / 2}
          offsetY={height / 2}
          stroke="#333"
          strokeWidth={1}
        />
      </Group>
      
      {isSelected && isDraggable && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          enabledAnchors={[]}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit scaling
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default VehicleNode;
