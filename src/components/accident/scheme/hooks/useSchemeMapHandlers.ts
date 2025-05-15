
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

export const useSchemeMapHandlers = ({ 
  addVehicle, 
  activeTab, 
  isDrawing, 
  onPathStart, 
  onPathContinue,
  onPathComplete, 
  currentPathPoints, 
  addAnnotation,
  pathColor,
  readOnly = false
}) => {
  // Use a ref to track if we're currently placing a vehicle
  const placingVehicleRef = useRef(false);

  const handleMapClick = useCallback((e) => {
    if (readOnly) return;

    const latlng = e.latlng;
    const coords: [number, number] = [latlng.lat, latlng.lng];

    switch (activeTab) {
      case 'vehicles':
        if (!placingVehicleRef.current) {
          placingVehicleRef.current = true;
          addVehicle(coords);
          toast.success('Véhicule ajouté', { id: 'add-vehicle' });
          setTimeout(() => {
            placingVehicleRef.current = false;
          }, 300);
        }
        break;
        
      case 'paths':
        if (!isDrawing) {
          // Start drawing a new path
          onPathStart(coords);
          toast.info('Début du tracé. Cliquez pour ajouter des points, double-cliquez pour terminer.', { id: 'path-start' });
        } else {
          // Continue drawing the current path
          onPathContinue(coords);
        }
        break;
        
      case 'annotations':
        addAnnotation(coords);
        toast.info('Note ajoutée. Cliquez dessus pour éditer le texte.', { id: 'add-annotation' });
        break;
    }
  }, [activeTab, addVehicle, addAnnotation, onPathStart, onPathContinue, isDrawing, readOnly]);

  const handleMapDblClick = useCallback((e) => {
    if (readOnly) return;
    
    // Only handle double click for paths tab
    if (activeTab === 'paths' && isDrawing && currentPathPoints.length > 1) {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      
      onPathComplete(pathColor);
      toast.success('Tracé complété', { id: 'path-complete' });
    }
  }, [activeTab, isDrawing, currentPathPoints, onPathComplete, pathColor, readOnly]);

  const handleKeyDown = useCallback((e) => {
    if (readOnly) return;
    
    // Cancel path drawing with escape key
    if (e.key === 'Escape' && isDrawing) {
      console.log('Cancelling path drawing with Escape key');
      onPathComplete(pathColor, true); // Pass true to indicate cancellation
      toast.info('Tracé annulé', { id: 'path-cancel' });
    }
  }, [isDrawing, onPathComplete, pathColor, readOnly]);

  // Map event hook that attaches the event handlers to the map
  const MapEventHandler = () => {
    const map = useMapEvents({
      click: handleMapClick,
      dblclick: handleMapDblClick,
    });
    
    // Add keyboard event listener for ESC key
    document.addEventListener('keydown', handleKeyDown);
    
    return null;
  };

  return {
    MapEventHandler
  };
};
