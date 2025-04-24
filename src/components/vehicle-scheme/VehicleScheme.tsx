
import React from 'react';
import Toolbar from './Toolbar';
import CanvasArea from './CanvasArea';
import Instructions from './Instructions';
import { useVehicleScheme } from './useVehicleScheme';

const VehicleScheme = () => {
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
    zoomOut
  } = useVehicleScheme();

  return (
    <div className="w-full">
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
    </div>
  );
};

export default VehicleScheme;
