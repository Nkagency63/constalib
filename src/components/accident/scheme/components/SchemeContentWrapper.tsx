
import React from 'react';
import SchemeContent from './SchemeContent';
import { useSchemeContainer } from '../hooks/useSchemeContainer';
import { SchemeData, GeolocationData } from '../../types';
import { SchemeMapProvider } from './SchemeMapProvider';

interface SchemeContentWrapperProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
  geolocationData?: GeolocationData;
}

const SchemeContentWrapper: React.FC<SchemeContentWrapperProps> = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
  geolocationData
}) => {
  const schemeState = useSchemeContainer({
    initialData,
    formData,
    onUpdateSchemeData: onUpdateSchemeData ? 
      (data: SchemeData) => onUpdateSchemeData(data) : undefined,
    onSchemeUpdate: onSchemeUpdate ? 
      (data: SchemeData) => onSchemeUpdate(data) : undefined,
    readOnly,
    geolocationData
  });
  
  return (
    <SchemeMapProvider geolocationData={geolocationData}>
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
        
        // Geolocation data
        geolocationData={geolocationData}
      />
    </SchemeMapProvider>
  );
};

export default SchemeContentWrapper;
