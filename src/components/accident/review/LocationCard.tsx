
import { MapPin, Navigation, Clock } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { GeolocationData } from '@/components/accident/types';

interface LocationCardProps {
  location: {
    address?: string;
    coordinates?: GeolocationData;
    locationText?: string;
  };
}

const LocationCard = ({ location }: LocationCardProps) => {
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

  return (
    <ReviewCard icon={<MapPin className="h-5 w-5 text-constalib-blue" />} title="Lieu de l'accident">
      <p className="text-sm text-constalib-dark-gray">{location.locationText || 'Lieu non spécifié'}</p>
      {location.address && (
        <p className="text-xs text-constalib-dark-gray mt-1">
          Adresse géolocalisée: {location.address}
        </p>
      )}
      {location.coordinates && (
        <div className="mt-2 space-y-1">
          <div className="text-xs text-constalib-dark-gray flex items-center gap-1">
            <Navigation className="h-3 w-3" />
            Coordonnées: {location.coordinates.lat?.toFixed(6)}, {location.coordinates.lng?.toFixed(6)}
          </div>
          
          {location.coordinates.accuracy && (
            <div className="text-xs text-constalib-dark-gray flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              Précision: {formatAccuracy(location.coordinates.accuracy)}
            </div>
          )}
          
          {location.coordinates.timestamp && (
            <div className="text-xs text-constalib-dark-gray flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Enregistrée le: {formatTimestamp(location.coordinates.timestamp)}
            </div>
          )}
        </div>
      )}
    </ReviewCard>
  );
};

export default LocationCard;
