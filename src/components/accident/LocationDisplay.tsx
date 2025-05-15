
import { RefreshCw, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LocationDisplayProps {
  currentLocation: {lat: number, lng: number} | null;
  formattedAddress: string;
  geocodingStatus: 'none' | 'success' | 'error';
  onRefresh: () => void;
}

const LocationDisplay = ({
  currentLocation,
  formattedAddress,
  geocodingStatus,
  onRefresh
}: LocationDisplayProps) => {
  if (!currentLocation) return null;

  return (
    <div className={`p-4 rounded-lg ${
      geocodingStatus === 'success' ? 'bg-green-50 border border-green-200' : 
      geocodingStatus === 'error' ? 'bg-red-50 border border-red-200' : 
      'bg-constalib-light-blue/30'
    }`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-constalib-dark flex items-center">
            <MapPin className="h-4 w-4 mr-1 inline" /> Localisation
            {geocodingStatus === 'success' && (
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                Validée
              </Badge>
            )}
          </h4>
          <p className="text-sm text-constalib-dark break-words">
            {formattedAddress || `Lat: ${currentLocation.lat.toFixed(6)}, Lng: ${currentLocation.lng.toFixed(6)}`}
          </p>
          <p className="text-xs text-constalib-dark-gray mt-1">
            Coordonnées: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
          </p>
        </div>
        
        {geocodingStatus !== 'none' && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onRefresh}
            className="h-8 w-8"
            title="Actualiser la géolocalisation"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationDisplay;
