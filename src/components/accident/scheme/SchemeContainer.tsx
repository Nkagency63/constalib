
import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import CanvasToolbar from './CanvasToolbar';
import SchemeToolbar from './SchemeToolbar';
import MapContainer from './MapContainer';
import { SchemeData } from '../types';
import { useVehicles } from '../hooks/useVehicles';
import { usePaths } from '../hooks/usePaths';
import { useAnnotations } from '../hooks/useAnnotations';
import { useSchemeHistory } from '../hooks/useSchemeHistory';
import { useSchemeMap } from '../hooks/useSchemeMap';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

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
  const { 
    vehicles, selectedVehicle, addVehicle, removeVehicle, 
    selectVehicle, setVehicles, rotateVehicle
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

  // Get default center coordinates from formData or use Paris as default
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];

  // Map click handler based on selected tool
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (readOnly) return;
    
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    switch (currentTool) {
      case 'vehicle':
        if (vehicles.length < 4) {
          const updatedVehicles = addVehicle(e.latlng);
          if (updatedVehicles) {
            saveToHistory({ vehicles: updatedVehicles, paths, annotations, center, zoom: 17 });
            // Auto-center on vehicles when a new one is added
            centerOnVehicles(updatedVehicles);
          }
        } else {
          toast.warning("Maximum de 4 véhicules atteint");
        }
        break;
        
      case 'path':
        if (isDrawing) {
          continuePath(newPoint);
        } else if (selectedVehicle) {
          // Start drawing a path from the selected vehicle
          const vehicle = vehicles.find(v => v.id === selectedVehicle);
          if (vehicle) {
            startPath(vehicle.position, vehicle.id, vehicle.color);
          }
        } else {
          startPath(newPoint);
        }
        break;
        
      case 'annotation':
        const updatedAnnotations = addAnnotation(newPoint);
        saveToHistory({
          vehicles,
          paths,
          annotations: updatedAnnotations,
          center,
          zoom: 17
        });
        break;
        
      case 'select':
      default:
        // In select mode, deselect current vehicle
        selectVehicle(null);
        break;
    }
  };

  const { mapRef, drawingLayerRef, handleMapReady, centerOnVehicles } = useSchemeMap({
    readOnly,
    handleMapClick,
    onReady: () => {
      setIsMapReady(true);
      initializeVehicles();
    }
  });

  // Setup keyboard controls for vehicles
  useKeyboardControls({
    selectedVehicle,
    readOnly,
    onRotateVehicle: rotateVehicle,
    onRemoveVehicle: removeVehicle
  });

  // Initialize vehicles if none exist and we have formData
  const initializeVehicles = () => {
    if (formData?.geolocation?.lat && formData?.geolocation?.lng && vehicles.length === 0) {
      const initialVehicles = [];
      
      // Add vehicle A if we have data
      if (formData.vehicleBrand && formData.vehicleModel) {
        initialVehicles.push({
          id: crypto.randomUUID(),
          position: [
            formData.geolocation.lat + 0.0002, 
            formData.geolocation.lng - 0.0002
          ],
          color: '#1e40af', // Bleu pour A
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          vehicleId: 'A',
          rotation: 0,
          isSelected: false
        });
      }
      
      // Add vehicle B if we have data
      if (formData.otherVehicle?.brand && formData.otherVehicle?.model) {
        initialVehicles.push({
          id: crypto.randomUUID(),
          position: [
            formData.geolocation.lat - 0.0002, 
            formData.geolocation.lng + 0.0002
          ],
          color: '#dc2626', // Rouge pour B
          brand: formData.otherVehicle.brand,
          model: formData.otherVehicle.model,
          vehicleId: 'B',
          rotation: 0,
          isSelected: false
        });
      }
      
      // Set initial vehicles if we have any
      if (initialVehicles.length > 0) {
        setVehicles(initialVehicles);
        saveToHistory({
          vehicles: initialVehicles,
          paths: [],
          annotations: [],
          center,
          zoom: 17
        });
        
        // Auto-center on vehicles after initialization
        setTimeout(() => centerOnVehicles(initialVehicles), 300);
      }
    }
  };

  // Handle undo with current state
  const handleUndoWrapper = () => {
    if (!canUndo) return;
    
    const currentState = { 
      vehicles, 
      paths, 
      annotations, 
      center, 
      zoom: mapRef.current?.getZoom() || 17 
    };
    
    const prevState = handleUndo(currentState);
    setVehicles(prevState.vehicles);
    setPaths(prevState.paths);
    setAnnotations(prevState.annotations);
    
    // Auto-center on vehicles after undo
    if (prevState.vehicles.length > 0) {
      setTimeout(() => centerOnVehicles(prevState.vehicles), 100);
    }
  };

  // Handle redo with current state
  const handleRedoWrapper = () => {
    if (!canRedo) return;
    
    const currentState = { 
      vehicles, 
      paths, 
      annotations, 
      center, 
      zoom: mapRef.current?.getZoom() || 17 
    };
    
    const nextState = handleRedo(currentState);
    setVehicles(nextState.vehicles);
    setPaths(nextState.paths);
    setAnnotations(nextState.annotations);
    
    // Auto-center on vehicles after redo
    if (nextState.vehicles.length > 0) {
      setTimeout(() => centerOnVehicles(nextState.vehicles), 100);
    }
  };

  // Handle export image action
  const handleExportImage = () => {
    if (!mapRef.current) {
      toast.error("Impossible d'exporter la carte");
      return;
    }

    try {
      toast.info("Préparation de l'image...");
      toast.success("Export d'image simulé - cette fonctionnalité nécessite html2canvas");
    } catch (error) {
      toast.error("Erreur lors de l'exportation de l'image");
      console.error("Erreur d'exportation:", error);
    }
  };

  // Center on vehicles when they change
  useEffect(() => {
    if (vehicles.length > 0 && isMapReady) {
      centerOnVehicles(vehicles);
    }
  }, [vehicles.length, isMapReady]);

  // Update scheme data when state changes
  useEffect(() => {
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
    <TooltipProvider>
      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
        {!readOnly && (
          <CanvasToolbar 
            onAddVehicle={() => {
              if (mapRef.current && vehicles.length < 4) {
                const center = mapRef.current.getCenter();
                const updatedVehicles = addVehicle(center);
                if (updatedVehicles) {
                  saveToHistory({ 
                    vehicles: updatedVehicles, 
                    paths, 
                    annotations, 
                    center: [center.lat, center.lng], 
                    zoom: mapRef.current.getZoom() 
                  });
                  centerOnVehicles(updatedVehicles);
                }
              } else {
                toast.warning("Maximum de 4 véhicules atteint");
              }
            }}
            onUndo={handleUndoWrapper}
            onRedo={handleRedoWrapper}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            canUndo={canUndo}
            canRedo={canRedo}
            onExportImage={handleExportImage}
            onCenterVehicles={() => centerOnVehicles(vehicles)}
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
          onRemoveAnnotation={removeAnnotation}
          onUpdateAnnotation={updateAnnotation}
          onMapReady={handleMapReady}
          readOnly={readOnly}
        />

        <div className="bg-white p-2 text-xs text-gray-500 border-t">
          {vehicles.length === 0 ? (
            <p>Cliquez sur la carte pour ajouter des véhicules, trajectoires, et annotations</p>
          ) : (
            <p>
              {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} • 
              {paths.length} trajectoire{paths.length > 1 ? 's' : ''} • 
              {annotations.length} annotation{annotations.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SchemeContainer;
