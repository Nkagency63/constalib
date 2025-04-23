
import React, { RefObject } from 'react';

interface MapContainerProps {
  mapRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  mapError: string | null;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapRef,
  isLoading,
  mapError,
}) => {
  return (
    <div
      ref={mapRef}
      id="accident-location-map"
      className="absolute inset-0 z-0"
      style={{ height: '100%', width: '100%' }}
      aria-hidden={isLoading || !!mapError}
    />
  );
};

export default MapContainer;
