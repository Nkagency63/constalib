
// Import base types from main types file instead of redeclaring them
import { Vehicle as BaseVehicle, Path as BasePath, Annotation as BaseAnnotation, SchemeData as BaseSchemeData } from '../types';

// Re-export types with different names to avoid conflicts
export type SchemeVehicle = BaseVehicle;
export type SchemePath = BasePath;
export type SchemeAnnotation = BaseAnnotation;
export type SchemeDataType = BaseSchemeData;

// For backward compatibility - use type aliases instead of export declarations
export type { 
  BaseVehicle as Vehicle, 
  BasePath as Path, 
  BaseAnnotation as Annotation,
  BaseSchemeData as SchemeData
};
