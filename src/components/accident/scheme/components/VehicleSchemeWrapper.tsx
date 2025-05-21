
import React from 'react';
import { SchemeData as BaseSchemeData } from '../../types';
import { SchemeData as TypesSchemeData } from '../../types/types';
import VehicleScheme from '../../../VehicleScheme';

interface VehicleSchemeWrapperProps {
  initialData?: BaseSchemeData;
  onUpdateSchemeData?: (data: BaseSchemeData) => void;
}

// Helper functions to map between different type formats
const convertVehicle = (v) => ({
  ...v,
  type: v.type || 'car',
  label: v.label || `Véhicule ${v.type || ''}`,
  x: v.x || (v.position ? v.position[0] : 0),
  y: v.y || (v.position ? v.position[1] : 0),
  width: v.width || 80,
  height: v.height || 40,
});

const convertPath = (p) => ({
  ...p,
  vehicleId: p.vehicleId || '',
  width: p.width || 3,
  dashArray: p.dashed ? '10, 10' : undefined,
  isSelected: p.isSelected || false,
});

const convertAnnotation = (a) => ({
  ...a,
  color: a.color || '#10b981',
});

const convertBackVehicle = (v) => ({
  ...v,
  type: (v.type === 'car' || v.type === 'truck' || v.type === 'bike') 
    ? v.type as 'car' | 'truck' | 'bike' 
    : 'car',
  position: [v.x || v.position[0], v.y || v.position[1]] as [number, number],
  label: v.label,
  isSelected: v.isSelected || false,
});

const convertBackPath = (p) => ({
  ...p,
  dashed: !!p.dashArray,
  width: p.width || 3,
  isSelected: p.isSelected || false,
  vehicleId: p.vehicleId,
});

const convertBackAnnotation = (a) => ({
  ...a,
  id: a.id,
  position: a.position,
  text: a.text,
  color: a.color,
});

// Helper function to convert between different SchemeData types
const convertSchemeData = (data: BaseSchemeData): TypesSchemeData => {
  return {
    vehicles: data.vehicles.map(convertVehicle),
    paths: data.paths.map(convertPath) || [],
    annotations: data.annotations.map(convertAnnotation) || [],
    center: data.center || [0, 0],
    zoom: data.zoom || 13
  };
};

const convertBackSchemeData = (data: TypesSchemeData): BaseSchemeData => {
  return {
    vehicles: data.vehicles.map(convertBackVehicle),
    paths: data.paths.map(convertBackPath),
    annotations: data.annotations.map(convertBackAnnotation),
    center: data.center,
    zoom: data.zoom
  };
};

const VehicleSchemeWrapper: React.FC<VehicleSchemeWrapperProps> = ({
  initialData,
  onUpdateSchemeData
}) => {
  return (
    <VehicleScheme
      initialData={initialData ? convertSchemeData(initialData) : undefined}
      onSchemeUpdate={onUpdateSchemeData ? 
        (data: TypesSchemeData) => onUpdateSchemeData(convertBackSchemeData(data)) : undefined}
    />
  );
};

export default VehicleSchemeWrapper;
