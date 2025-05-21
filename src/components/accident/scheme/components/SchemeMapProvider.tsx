
import React, { createContext, useContext, useRef } from 'react';
import { SchemeData, GeolocationData } from '../../types';
import L from 'leaflet';

interface SchemeMapContextType {
  mapRef: React.MutableRefObject<L.Map | null>;
  drawingLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  geolocationData?: GeolocationData;
}

const SchemeMapContext = createContext<SchemeMapContextType | undefined>(undefined);

interface SchemeMapProviderProps {
  children: React.ReactNode;
  geolocationData?: GeolocationData;
}

export const SchemeMapProvider: React.FC<SchemeMapProviderProps> = ({ 
  children,
  geolocationData
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  
  return (
    <SchemeMapContext.Provider value={{
      mapRef,
      drawingLayerRef,
      geolocationData
    }}>
      {children}
    </SchemeMapContext.Provider>
  );
};

export const useSchemeMap = (): SchemeMapContextType => {
  const context = useContext(SchemeMapContext);
  if (context === undefined) {
    throw new Error('useSchemeMap must be used within a SchemeMapProvider');
  }
  return context;
};
