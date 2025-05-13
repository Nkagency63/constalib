
// Import base types instead of redeclaring them
import { Vehicle, Path, Annotation, SchemeData as BaseSchemeData } from '../types';

// Re-export the types to maintain backward compatibility without creating conflicts
export type { Vehicle, Path, Annotation };
export type SchemeData = BaseSchemeData;
