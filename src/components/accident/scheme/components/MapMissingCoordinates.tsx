
import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapMissingCoordinatesProps {
  onRetry: () => void;
}

const MapMissingCoordinates: React.FC<MapMissingCoordinatesProps> = ({
  onRetry,
}) => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
    <div className="text-center p-4">
      <p className="text-constalib-dark-gray mb-2">
        <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
        Coordonnées GPS manquantes
      </p>
      <Button onClick={onRetry} size="sm">
        <RefreshCcw className="w-4 h-4 mr-2" />
        Réessayer
      </Button>
    </div>
  </div>
);

export default MapMissingCoordinates;
