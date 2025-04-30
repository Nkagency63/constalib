
import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import CanvasToolbar from './CanvasToolbar';
import SchemeToolbar from './SchemeToolbar';
import MapContainer from './MapContainer';
import SchemeInfo from './SchemeInfo';
import SchemeGuide from './SchemeGuide';
import StepByStepGuide from './StepByStepGuide';
import KeyboardShortcuts from './KeyboardShortcuts';
import { SchemeData } from '../types';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';
import { useSchemeHistory } from '../hooks/useSchemeHistory';
import { useSchemeMap } from '../hooks/useSchemeMap';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { handleMapClick } from './SchemeMapHandlers';
import { initializeVehicles } from './SchemeVehicleInitializer';
import { handleUndoWrapper, handleRedoWrapper } from './SchemeUndoRedo';
import { handleExportImage } from './SchemeExport';

interface SchemeContainerProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
  readOnly?: boolean;
}

const SchemeContainer = ({ 
  formData, 
  onUpdateSchemeData, 
  readOnly = false 
}: SchemeContainerProps) => {
  // Custom hooks
  const { toast } = useToast();
  
  const { 
    vehicles, selectedVehicle, addVehicle, removeVehicle, 
    selectVehicle, setVehicles, rotateVehicle, changeVehicleType,
    currentVehicleType
  } = useVehicles();
  
  const {
    paths, setPaths, currentPathPoints, isDrawing,
    startPath, continuePath, completePath, resetPath
  } = usePaths();
  
  const {
    annotations, setAnnotations, addAnnotation,
    updateAnnotation, removeAnnotation
  } = useAnnotations();
  
  const { 
    saveToHistory, handleUndo, handleRedo, canUndo, canRedo 
  } = useSchemeHistory();
  
  // Local state
  const [currentTool, setCurrentTool] = useState<'select' | 'vehicle' | 'path' | 'annotation'>('select');
  const [isMapReady, setIsMapReady] = useState(false);
  const [showGuidesFirstTime, setShowGuidesFirstTime] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(0); // Pour limiter la fréquence des mises à jour
  const [mapInitialized, setMapInitialized] = useState(false);

  // Get default center coordinates from formData or use Paris as default
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];

  const { mapRef, drawingLayerRef, handleMapReady, centerOnVehicles } = useSchemeMap({
    readOnly,
    handleMapClick: (e) => handleMapClick(e, {
      readOnly,
      currentTool,
      vehicles,
      paths,
      annotations,
      selectedVehicle,
      isDrawing,
      centerOnVehicles,
      saveToHistory,
      addVehicle,
      selectVehicle,
      startPath,
      continuePath,
      addAnnotation
    }),
    onReady: () => {
      console.log("Map is ready");
      setIsMapReady(true);
      setMapInitialized(true);
      
      const initialized = initializeVehicles({
        formData,
        vehiclesLength: vehicles.length,
        setVehicles,
        saveToHistory
      });
      
      if (initialized) {
        console.log("Vehicles initialized successfully");
        // Auto-center on vehicles after initialization
        setTimeout(() => centerOnVehicles(vehicles), 300);
      } else if (showGuidesFirstTime) {
        // Pour les nouveaux utilisateurs, montrer un toast de bienvenue
        toast({
          title: "Bienvenue sur l'éditeur de schéma d'accident",
          description: "Utilisez les outils sur la gauche pour créer votre schéma. Commencez par ajouter un véhicule.",
          duration: 6000,
        });
        setShowGuidesFirstTime(false);
      }
    }
  });

  useKeyboardControls({
    selectedVehicle,
    readOnly,
    onRotateVehicle: rotateVehicle,
    onRemoveVehicle: removeVehicle
  });

  // Effet pour centrer sur les véhicules quand la carte est prête
  useEffect(() => {
    if (isMapReady && mapRef.current && vehicles.length > 0) {
      console.log("Centering on vehicles after map ready");
      setTimeout(() => centerOnVehicles(vehicles), 300);
    }
  }, [isMapReady, vehicles.length, mapRef.current]);

  // Effet pour rafraîchir la carte quand currentTool change
  useEffect(() => {
    if (mapRef.current && isMapReady) {
      console.log("Tool changed, invalidating map size");
      mapRef.current.invalidateSize();
    }
  }, [currentTool, isMapReady]);

  // Update scheme data when state changes - avec limitation de fréquence
  useEffect(() => {
    if (onUpdateSchemeData && mapRef.current) {
      const now = Date.now();
      // Limiter les mises à jour à une fois toutes les 2 secondes
      if (now - lastUpdateTime > 2000) {
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
        setLastUpdateTime(now);
      }
    }
  }, [vehicles, paths, annotations, onUpdateSchemeData]);

  // Handle vehicle add from toolbar
  const handleAddVehicle = () => {
    if (!mapRef.current) {
      console.error("Map reference not available");
      return;
    }
    
    if (vehicles.length < 4) {
      console.log("Adding vehicle from toolbar");
      const center = mapRef.current.getCenter();
      const updatedVehicles = addVehicle(center);
      
      if (updatedVehicles) {
        console.log("Vehicle added successfully from toolbar");
        saveToHistory({ 
          vehicles: updatedVehicles, 
          paths, 
          annotations, 
          center: [center.lat, center.lng], 
          zoom: mapRef.current.getZoom() 
        });
        
        // Assurez-vous que la mise à jour est reflétée dans l'UI
        setTimeout(() => {
          console.log("Centering on vehicles after adding");
          centerOnVehicles(updatedVehicles);
          mapRef.current?.invalidateSize();
        }, 100);
        
        // Afficher un toast de guidance après l'ajout du premier véhicule
        if (updatedVehicles.length === 1) {
          toast({
            title: "Véhicule ajouté",
            description: "Vous pouvez maintenant le déplacer ou le faire pivoter. Utilisez l'outil trajectoire pour tracer son parcours.",
            duration: 5000,
          });
        }
      } else {
        console.error("Failed to add vehicle from toolbar");
      }
    } else {
      sonnerToast.warning("Maximum de 4 véhicules atteint");
    }
  };

  const isEmpty = vehicles.length === 0;

  // Auto-switch to vehicle tool when clicking "Add Vehicle" button
  const handleToolbarAddVehicle = () => {
    setCurrentTool('vehicle');
    setTimeout(handleAddVehicle, 100);
  };

  return (
    <TooltipProvider>
      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
        {!readOnly && (
          <CanvasToolbar 
            onAddVehicle={handleToolbarAddVehicle}
            onUndo={() => handleUndoWrapper({
              canUndo,
              canRedo,
              vehicles,
              paths,
              annotations,
              handleUndo,
              handleRedo,
              setVehicles,
              setPaths,
              setAnnotations,
              centerOnVehicles,
              mapRef
            })}
            onRedo={() => handleRedoWrapper({
              canUndo,
              canRedo,
              vehicles,
              paths,
              annotations,
              handleUndo,
              handleRedo,
              setVehicles,
              setPaths,
              setAnnotations,
              centerOnVehicles,
              mapRef
            })}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            canUndo={canUndo}
            canRedo={canRedo}
            onExportImage={() => handleExportImage({ mapRef })}
            onCenterVehicles={() => centerOnVehicles(vehicles)}
            currentVehicleType={currentVehicleType}
            onChangeVehicleType={changeVehicleType}
          />
        )}

        {!readOnly && (
          <SchemeToolbar 
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
          />
        )}

        <MapContainer 
          center={center}
          zoom={17}
          vehicles={vehicles}
          paths={paths}
          annotations={annotations}
          currentPathPoints={currentPathPoints}
          drawingLayerRef={drawingLayerRef}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={selectVehicle}
          onRemoveVehicle={removeVehicle}
          onRotateVehicle={rotateVehicle}
          onChangeVehicleType={changeVehicleType}
          onRemoveAnnotation={removeAnnotation}
          onUpdateAnnotation={updateAnnotation}
          onMapReady={handleMapReady}
          readOnly={readOnly}
        />

        {/* Ajout des composants de guidance */}
        {!readOnly && (
          <>
            <SchemeGuide 
              currentTool={currentTool}
              isEmpty={isEmpty}
            />
            
            <StepByStepGuide 
              vehicleCount={vehicles.length}
              pathCount={paths.length}
              annotationCount={annotations.length}
            />
            
            <KeyboardShortcuts 
              selectedVehicle={selectedVehicle}
            />
          </>
        )}

        <SchemeInfo 
          vehicleCount={vehicles.length}
          pathCount={paths.length}
          annotationCount={annotations.length}
          isEmpty={isEmpty}
        />
      </div>
    </TooltipProvider>
  );
};

export default SchemeContainer;
