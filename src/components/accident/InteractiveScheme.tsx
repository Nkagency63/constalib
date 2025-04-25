
import React from 'react';
import { useSchemeState } from './hooks/useSchemeState';
import { SchemeProvider } from './context/SchemeContext';
import SchemeMap from './scheme/SchemeMap';
import SchemeHelpAlert from './scheme/SchemeHelpAlert';
import CanvasToolbar from './scheme/CanvasToolbar';
import SchemeToolbar from './scheme/SchemeToolbar';
import type { SchemeData } from './types';

interface InteractiveSchemeProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
  readOnly?: boolean;
}

const InteractiveScheme = ({ 
  formData, 
  onUpdateSchemeData, 
  readOnly = false 
}: InteractiveSchemeProps) => {
  const schemeState = useSchemeState(formData, onUpdateSchemeData, readOnly);
  
  const {
    mapRef,
    drawingLayerRef,
    currentTool,
    setCurrentTool,
    vehicles,
    paths,
    annotations,
    selectedVehicle,
    center,
    handleMapClick,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    addVehicle,
    VEHICLE_COLORS
  } = schemeState;

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    drawingLayerRef.current = L.layerGroup().addTo(map);
    
    if (!readOnly) {
      map.on('click', handleMapClick);
    }
    
    if (formData?.geolocation?.lat && formData?.geolocation?.lng && vehicles.length === 0) {
      const { lat, lng } = formData.geolocation;
      
      if (formData.vehicleBrand && formData.vehicleModel) {
        addVehicle(L.latLng(lat + 0.0002, lng - 0.0002));
      }
      
      if (formData.otherVehicle?.brand && formData.otherVehicle?.model) {
        addVehicle(L.latLng(lat - 0.0002, lng + 0.0002));
      }
    }
  };

  React.useEffect(() => {
    if (onUpdateSchemeData && mapRef.current) {
      const schemeData: SchemeData = {
        vehicles,
        paths,
        annotations,
        center: mapRef.current ? [
          mapRef.current.getCenter().lat,
          mapRef.current.getCenter().lng
        ] as [number, number] : center,
        zoom: mapRef.current ? mapRef.current.getZoom() : 17
      };
      onUpdateSchemeData(schemeData);
    }
  }, [vehicles, paths, annotations, onUpdateSchemeData]);

  return (
    <SchemeProvider value={{
      mapRef,
      drawingLayerRef,
      currentTool,
      vehicles,
      paths,
      annotations,
      selectedVehicle,
      readOnly,
      center,
      handleMapClick
    }}>
      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
        {!readOnly && (
          <CanvasToolbar 
            onAddVehicle={() => {
              if (mapRef.current) {
                const center = mapRef.current.getCenter();
                addVehicle(center);
              }
            }}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}

        {!readOnly && (
          <SchemeToolbar 
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
          />
        )}

        {!readOnly && <SchemeHelpAlert />}

        <SchemeMap onMapReady={handleMapReady} />
      </div>
    </SchemeProvider>
  );
};

export default InteractiveScheme;
