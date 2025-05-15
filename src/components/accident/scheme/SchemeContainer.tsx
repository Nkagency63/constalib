
import React from 'react';
import { SchemeData } from '../types';
import { useSchemeContainer } from './hooks/useSchemeContainer';
import SchemeContent from './components/SchemeContent';

interface SchemeContainerProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
}

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
}) => {
  // Use our custom hook to manage the scheme state
  const schemeState = useSchemeContainer({
    initialData,
    formData,
    onUpdateSchemeData,
    onSchemeUpdate,
    readOnly
  });
  
  return (
    <SchemeContent
      // Map state
      mapCenter={schemeState.mapCenter}
      mapZoom={schemeState.mapZoom}
      drawingLayerRef={schemeState.drawingLayerRef}
      
      // UI state
      currentTool={schemeState.currentTool}
      setCurrentTool={schemeState.setCurrentTool}
      pathColor={schemeState.pathColor}
      setPathColor={schemeState.setPathColor}
      isEmpty={schemeState.isEmpty}
      
      // Hooks data and methods
      vehicles={schemeState.vehicles}
      setVehicles={schemeState.setVehicles}
      selectedVehicle={schemeState.selectedVehicle}
      currentVehicleType={schemeState.currentVehicleType}
      onChangeVehicleType={schemeState.onChangeVehicleType}
      selectVehicle={schemeState.selectVehicle}
      removeVehicle={schemeState.removeVehicle}
      rotateVehicle={schemeState.rotateVehicle}
      
      paths={schemeState.paths}
      setPaths={schemeState.setPaths}
      currentPathPoints={schemeState.currentPathPoints}
      
      annotations={schemeState.annotations}
      setAnnotations={schemeState.setAnnotations}
      updateAnnotation={schemeState.updateAnnotation}
      removeAnnotation={schemeState.removeAnnotation}
      
      // Handlers
      handleMapReadyFromHook={schemeState.handleMapReadyFromHook}
      handleCenterOnVehicles={schemeState.handleCenterOnVehicles}
      
      // Read-only state
      readOnly={readOnly}
      
      // Map refs
      mapRef={schemeState.mapRef}
    />
  );
};

export default SchemeContainer;
