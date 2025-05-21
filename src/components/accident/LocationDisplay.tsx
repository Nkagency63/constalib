
import { MapPin, Navigation, Calendar, Clock, MapPinOff, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeolocationData } from './types';
import { useState } from 'react';
import { getAddressFromCoordinates } from '@/utils/geocoding';
import { toast } from 'sonner';

interface LocationDisplayProps {
  geolocation: GeolocationData;
  setMapVisible: (visible: boolean) => void;
}

const LocationDisplay = ({
  geolocation,
  setMapVisible
}: LocationDisplayProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  if (!geolocation || !geolocation.lat || !geolocation.lng) return null;

  const formatTimestamp = (timestamp?: number | string) => {
    if (!timestamp) return '';
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    return date.toLocaleString('fr-FR');
  };

  const formatAccuracy = (accuracy?: number) => {
    if (!accuracy) return '';
    return accuracy < 1000 
      ? `${Math.round(accuracy)} mètres` 
      : `${(accuracy / 1000).toFixed(2)} km`;
  };
  
  const handleRefreshAddress = async () => {
    if (!geolocation || !geolocation.lat || !geolocation.lng) return;
    
    setIsRefreshing(true);
    try {
      const address = await getAddressFromCoordinates(geolocation.lat, geolocation.lng);
      // Mettre à jour l'affichage sans modifier l'objet original
      toast.success("Adresse actualisée", {
        description: address
      });
    } catch (error) {
      console.error("Erreur lors de l'actualisation de l'adresse:", error);
      toast.error("Impossible d'actualiser l'adresse");
    } finally {
      setIsRefreshing(false);
    }
  };

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
          <div className="text-xs text-constalib-dark-gray mt-1 flex items-center gap-1">
            <Navigation className="h-3 w-3" />
            Coordonnées: {geolocation.lat.toFixed(6)}, {geolocation.lng.toFixed(6)}
          </div>
          
          {geolocation.accuracy && (
            <div className="text-xs text-constalib-dark-gray mt-1 flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              Précision: {formatAccuracy(geolocation.accuracy)}
            </div>
          )}
          
          {geolocation.timestamp && (
            <div className="text-xs text-constalib-dark-gray mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Enregistrée le: {formatTimestamp(geolocation.timestamp)}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMapVisible(true)}
            className="text-xs flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Voir sur la carte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;
