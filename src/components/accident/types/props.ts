
import { FormData, SchemeData, WitnessInfo, Circumstance } from "../types";
import { Vehicle, Path, Annotation } from "../types/scheme";

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
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  paths: Path[];
  annotations: Annotation[];
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
  drawingLayerRef?: React.MutableRefObject<any>;
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
  onRemoveVehicle?: (id: string) => void;
  onRotateVehicle?: (id: string, degrees: number) => void;
  onChangeVehicleType?: (id: string, type: 'car' | 'truck' | 'bike') => void;
}

// Props for SchemeToolbars component
export interface SchemeToolbarsProps {
  activeTab?: 'vehicles' | 'paths' | 'annotations';
  setActiveTab?: (tab: 'vehicles' | 'paths' | 'annotations') => void;
  vehicles: any;
  paths: any;
  annotations: any;
  pathColor?: string;
  setPathColor?: (color: string) => void;
  readOnly: boolean;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  setCurrentTool: (tool: 'select' | 'vehicle' | 'path' | 'annotation') => void;
  onAddVehicle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  handleUndo: (currentState: any) => any;
  handleRedo: (currentState: any) => any;
  setVehicles: (vehicles: Vehicle[]) => void;
  setPaths: (paths: Path[]) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  centerOnVehicles: (vehicles: Vehicle[]) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
  currentVehicleType: 'car' | 'truck' | 'bike';
  onChangeVehicleType: (type: 'car' | 'truck' | 'bike') => void;
}
