
// This file is temporarily not being used to prevent rendering errors
import React from 'react';
import { Vehicle } from './types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Map } from 'lucide-react';

interface MapViewProps {
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  onVehicleSelect: (id: string) => void;
  onVehicleMove: (id: string, lat: number, lng: number) => void;
  onVehicleRotate: (id: string, angle: number) => void;
  onVehicleRemove: (id: string) => void;
  onVehicleAdd: () => void;
}

const MapView = (props: MapViewProps) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-amber-50 border-amber-200">
        <Map className="h-4 w-4 text-amber-500 mr-2" />
        <AlertDescription className="text-amber-800 text-sm">
          La carte interactive est temporairement indisponible.
        </AlertDescription>
      </Alert>
      
      <div className="h-[400px] rounded-lg overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center">
        <div className="text-center p-4">
          <Map className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Carte non disponible</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
