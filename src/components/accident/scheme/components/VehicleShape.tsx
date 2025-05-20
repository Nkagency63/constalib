
import React from 'react';
import { Rect, Group, Text, Transformer } from 'react-konva';

interface VehicleShapeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (props: { x?: number, y?: number, rotation?: number }) => void;
  onTransformEnd?: () => void;
}

const VehicleShape: React.FC<VehicleShapeProps> = ({
  id,
  x,
  y,
  width,
  height,
  rotation,
  color,
  label,
  isSelected,
  onSelect,
  onChange,
  onTransformEnd,
}) => {
  const shapeRef = React.useRef<any>(null);
  const trRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (isSelected && trRef.current) {
      // Attacher le transformer au groupe
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    // Transformer change les valeurs de scale, nous devons ajuster la taille et la position
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Réinitialiser le scale pour ne pas l'accumuler
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    });

    if (onTransformEnd) {
      onTransformEnd();
    }
  };

  return (
    <React.Fragment>
      <Group
        ref={shapeRef}
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          width={width}
          height={height}
          fill={color}
          shadowBlur={isSelected ? 10 : 0}
          shadowColor={isSelected ? 'yellow' : 'transparent'}
          cornerRadius={5}
        />
        <Text
          text={label}
          fill="white"
          fontSize={14}
          width={width}
          align="center"
          verticalAlign="middle"
          height={height}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          rotateEnabled={true}
          resizeEnabled={false}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => newBox}
        />
      )}
    </React.Fragment>
  );
};

export default VehicleShape;
