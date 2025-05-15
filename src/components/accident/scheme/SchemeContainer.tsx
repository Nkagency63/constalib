
import React, { useEffect } from 'react';
import { SchemeData } from '../types';
import { useSchemeContainer } from './hooks/useSchemeContainer';
import SchemeContent from './components/SchemeContent';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

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
  
  // Log formData to debug geolocation issues
  useEffect(() => {
    if (formData?.geolocation) {
      console.log("SchemeContainer received geolocation:", formData.geolocation);
    }
    
    // If we have geolocation but the map isn't centered on it yet
    if (formData?.geolocation?.lat && 
        formData?.geolocation?.lng && 
        schemeState.mapRef.current) {
          
      const targetLat = formData.geolocation.lat;
      const targetLng = formData.geolocation.lng;
      
      console.log("Attempting to center map on:", [targetLat, targetLng]);
      
      // Force update map center with a slight delay to ensure map is initialized
      setTimeout(() => {
        if (schemeState.mapRef.current) {
          console.log("Setting map center to:", [targetLat, targetLng]);
          schemeState.mapRef.current.setView([targetLat, targetLng], 17);
          toast({
            title: "Carte mise à jour",
            description: "La carte a été centrée sur la position indiquée"
          });
        } else {
          console.error("Map reference not available when trying to center");
        }
      }, 800); // Increased delay for better initialization
    }
  }, [formData?.geolocation, schemeState.mapRef]);
  
  return (
    <TooltipProvider>
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
    </TooltipProvider>
  );
};

export default SchemeContainer;
