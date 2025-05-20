
import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';

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
  onChange: (newAttrs: { x?: number; y?: number; rotation?: number }) => void;
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
  onTransformEnd
}) => {
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // Attacher le transformer au véhicule
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      const node = shapeRef.current;
      
      // Récupérer la nouvelle rotation
      const newRotation = node.rotation();
      
      // Mettre à jour avec les nouvelles valeurs
      onChange({
        rotation: newRotation
      });
      
      if (onTransformEnd) {
        onTransformEnd();
      }
    }
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={x}
        y={y}
        rotation={rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        {/* Corps du véhicule */}
        <Rect
          width={width}
          height={height}
          fill={color}
          strokeWidth={isSelected ? 2 : 0}
          stroke="#000000"
          cornerRadius={5}
          shadowColor="black"
          shadowBlur={isSelected ? 10 : 5}
          shadowOpacity={isSelected ? 0.3 : 0.2}
          shadowOffset={{ x: 2, y: 2 }}
        />
        
        {/* Pare-brise (élément visuel simple) */}
        <Rect
          x={width * 0.15}
          y={height * 0.2}
          width={width * 0.7}
          height={height * 0.25}
          fill="lightblue"
        />
        
        {/* Étiquette du véhicule */}
        <Text
          text={label}
          fill="white"
          fontSize={14}
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          width={width}
          height={height}
          offsetY={-height / 2 - 15} // Place l'étiquette au-dessus du véhicule
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limiter le redimensionnement (garder seulement la rotation)
            return oldBox;
          }}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          enabledAnchors={[]}
        />
      )}
    </>
  );
};

export default VehicleShape;
