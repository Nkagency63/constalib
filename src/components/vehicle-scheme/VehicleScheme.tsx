
import React, { useState } from 'react';
import Toolbar from './Toolbar';
import CanvasArea from './CanvasArea';
import Instructions from './Instructions';
import { useVehicleScheme } from './useVehicleScheme';
import MapView from './MapView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapIcon, Car } from 'lucide-react';

interface VehicleSchemeProps {
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
}

const VehicleScheme = ({ geolocation }: VehicleSchemeProps) => {
  const [activeView, setActiveView] = useState<'canvas' | 'map'>('canvas');
  
  const {
    vehicles,
    selectedVehicle,
    zoom,
    isDragging,
    canvasRef,
    historyIndex,
    history,
    addVehicle,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    rotateVehicle,
    removeVehicle,
    undo,
    redo,
    zoomIn,
    zoomOut,
    setVehicles,
    setSelectedVehicle
  } = useVehicleScheme();

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="canvas" onValueChange={(value) => setActiveView(value as 'canvas' | 'map')}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="canvas" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            Schéma simplifié
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center">
            <MapIcon className="mr-2 h-4 w-4" />
            Vue sur carte
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="canvas" className="space-y-4">
          <Toolbar
            onAddVehicle={addVehicle}
            onUndo={undo}
            onRedo={redo}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
          
          <CanvasArea
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            zoom={zoom}
            isDragging={isDragging}
            canvasRef={canvasRef}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            rotateVehicle={rotateVehicle}
            removeVehicle={removeVehicle}
          />
          
          <Instructions />
        </TabsContent>
        
        <TabsContent value="map" className="space-y-4">
          <Toolbar
            onAddVehicle={addVehicle}
            onUndo={undo}
            onRedo={redo}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
          
          <MapView
            geolocation={geolocation}
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
            onVehicleMove={(id, lat, lng) => {
              setVehicles(prevVehicles => 
                prevVehicles.map(v => 
                  v.id === id ? { ...v, mapLat: lat, mapLng: lng } : v
                )
              );
            }}
            onVehicleRotate={rotateVehicle}
            onVehicleRemove={removeVehicle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleScheme;
