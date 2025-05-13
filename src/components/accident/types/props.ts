
import { FormData, SchemeData, WitnessInfo, Circumstance } from "../types";

// Props for SignatureDialog
export interface SignatureDialogProps {
  open: boolean;
  onClose: () => void;
  onSign: (partyA: string, partyB: string) => void;
}

// Props for OfficialRegistrationDialog
export interface OfficialRegistrationDialogProps {
  open: boolean;
  onClose: () => void;
  onRegister: () => Promise<void>;
  isRegistering: boolean;
  referenceId?: string | null;
}

// Props for SchemeStep
export interface SchemeStepProps {
  formData: FormData;
  onSchemeUpdate?: (schemeData: SchemeData) => void;
  handleSchemeData?: (data: SchemeData) => void;
}

// Props for MapContainer in SchemeMapWrapper
export interface MapContainerProps {
  center: [number, number];
  zoom: number;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  vehicles: any[];
  selectedVehicleId?: string;
  paths: any[];
  annotations: any[];
  onVehicleSelect: (id: string) => void;
  onRemoveVehicle: (id: string) => void;
  onRotateVehicle: (id: string, angle: number) => void;
  onChangeVehicleType: (id: string, type: 'car' | 'truck' | 'bike') => void;
  onPathSelect: (id: string) => void;
  onPathRemove: (id: string) => void;
  onAnnotationSelect: (id: string) => any;
  onAnnotationRemove: (id: string) => void;
  onAnnotationUpdate: (id: string, text: string) => void;
  activeTab: 'vehicles' | 'paths' | 'annotations';
  readOnly: boolean;
  onPathStart: (point: [number, number]) => void;
  onPathContinue: (point: [number, number]) => void;
  onPathComplete: (color: string) => void;
  currentPathPoints: [number, number][];
  isDrawing: boolean;
  pathColor: string;
  isTilting: boolean;
  drawingLayerRef?: React.MutableRefObject<any>; // Add missing prop
}

// Props for VehicleIcon
export interface VehicleIconProps {
  type: 'car' | 'truck' | 'bike';
  rotation: number;
  color: string;
  selected?: boolean;
}

// Props for VehiclesLayer
export interface VehiclesLayerProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleSelect: (id: string) => void;
  onVehicleMove?: (id: string, position: [number, number]) => void;
  readOnly?: boolean;
  onRemoveVehicle?: (id: string) => void; // Add missing prop
  onRotateVehicle?: (id: string, degrees: number) => void; // Add missing prop
  onChangeVehicleType?: (type: 'car' | 'truck' | 'bike') => void; // Add missing prop
}
