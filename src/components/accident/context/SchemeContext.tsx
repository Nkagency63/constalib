
import React, { createContext, useContext } from 'react';
import L from 'leaflet';
import { Vehicle, Path, Annotation, SchemeData } from '../types';

interface SchemeContextType {
  mapRef: React.MutableRefObject<L.Map | null>;
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  vehicles: Vehicle[];
  paths: Path[];
  annotations: Annotation[];
  selectedVehicle: string | null;
  readOnly: boolean;
  center: [number, number];
  handleMapClick: (e: L.LeafletMouseEvent) => void;
}

const SchemeContext = createContext<SchemeContextType | null>(null);

export const useSchemeContext = () => {
  const context = useContext(SchemeContext);
  if (!context) {
    throw new Error('useSchemeContext must be used within a SchemeProvider');
  }
  return context;
};

export const SchemeProvider = SchemeContext.Provider;
