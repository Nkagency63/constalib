
import { MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LocationDisplayProps {
  geolocation: {lat: number | null, lng: number | null, address: string};
  setMapVisible: (visible: boolean) => void;
}

const LocationDisplay = ({
  geolocation,
  setMapVisible
}: LocationDisplayProps) => {
  if (!geolocation.lat || !geolocation.lng) return null;

  return (
    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-constalib-dark flex items-center">
            <MapPin className="h-4 w-4 mr-1 inline" /> Localisation
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
              Validée
            </Badge>
          </h4>
          <p className="text-sm text-constalib-dark break-words">
            {geolocation.address || `Lat: ${geolocation.lat.toFixed(6)}, Lng: ${geolocation.lng.toFixed(6)}`}
          </p>
          <p className="text-xs text-constalib-dark-gray mt-1">
            Coordonnées: {geolocation.lat.toFixed(6)}, {geolocation.lng.toFixed(6)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMapVisible(true)}
          className="text-xs"
        >
          Voir sur la carte
        </Button>
      </div>
    </div>
  );
};

export default LocationDisplay;
