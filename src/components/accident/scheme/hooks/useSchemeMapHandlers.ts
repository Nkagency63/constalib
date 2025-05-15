
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast'; 
import { toast } from 'sonner';
import { SchemeData } from '../../types';
import { useSchemeMap } from '../../hooks/useSchemeMap';
import { handleMapClick } from '../SchemeMapHandlers';
import { initializeVehicles } from '../SchemeVehicleInitializer';

export const useSchemeMapHandlers = (
  formData: any,
  readOnly: boolean,
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation',
  vehicles: any[],
  paths: any[],
  annotations: any[],
  selectedVehicle: string | null,
  isDrawing: boolean,
  saveToHistory: (state: any) => void,
  addVehicle: (latlng: L.LatLng) => any[] | null,
  selectVehicle: (id: string | null) => void,
  startPath: (point: [number, number], vehicleId?: string, color?: string | null) => void,
  continuePath: (point: [number, number]) => void,
  addAnnotation: (point: [number, number]) => any[],
  setVehicles: (vehicles: any[]) => void,
  setShowGuidesFirstTime: (show: boolean) => void,
  setIsMapReady: (ready: boolean) => void,
  setMapInitialized: (initialized: boolean) => void,
  showGuidesFirstTime: boolean
) => {
  const { toast: uiToast } = useToast();
  
  // Get default center coordinates from formData or use Paris as default
  const center: [number, number] = formData?.geolocation?.lat && formData?.geolocation?.lng
    ? [formData.geolocation.lat, formData.geolocation.lng]
    : [48.8566, 2.3522];

  const handleOnMapReady = useCallback(() => {
    console.log("Map is ready");
    setIsMapReady(true);
    setMapInitialized(true);
    
    try {
      const initialized = initializeVehicles({
        formData,
        vehiclesLength: vehicles.length,
        setVehicles,
        saveToHistory
      });
      
      if (initialized) {
        console.log("Vehicles initialized successfully");
        // Auto-center on vehicles after initialization
        setTimeout(() => centerOnVehicles(vehicles), 400);
      } else if (showGuidesFirstTime) {
        // Pour les nouveaux utilisateurs, montrer un toast de bienvenue
        uiToast({
          title: "Bienvenue sur l'éditeur de schéma d'accident",
          description: "Utilisez les outils sur la gauche pour créer votre schéma. Commencez par ajouter un véhicule.",
          duration: 6000,
        });
        setShowGuidesFirstTime(false);
      }
    } catch (error) {
      console.error("Error in map initialization:", error);
    }
  }, [formData, vehicles, setVehicles, saveToHistory, setIsMapReady, setMapInitialized, setShowGuidesFirstTime, showGuidesFirstTime]);

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
    onReady: handleOnMapReady
  });

  const handleToolbarAddVehicle = useCallback(() => {
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
        }, 200);
        
        // Afficher un toast de guidance après l'ajout du premier véhicule
        if (updatedVehicles.length === 1) {
          uiToast({
            title: "Véhicule ajouté",
            description: "Vous pouvez maintenant le déplacer ou le faire pivoter. Utilisez l'outil trajectoire pour tracer son parcours.",
            duration: 5000,
          });
        }
      } else {
        console.error("Failed to add vehicle from toolbar");
      }
    } else {
      toast.warning("Maximum de 4 véhicules atteint");
    }
  }, [mapRef, vehicles, addVehicle, paths, annotations, saveToHistory, centerOnVehicles]);

  return {
    mapRef,
    drawingLayerRef,
    handleMapReady,
    centerOnVehicles,
    center,
    handleToolbarAddVehicle
  };
};
