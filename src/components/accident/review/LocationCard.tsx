
import { MapPin } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface LocationCoordinates {
  lat?: number;
  lng?: number;
}

interface LocationCardProps {
  location: {
    address?: string;
    coordinates?: LocationCoordinates;
    locationText?: string;
  };
}

const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <ReviewCard icon={<MapPin className="h-5 w-5 text-constalib-blue" />} title="Lieu de l'accident">
      <p className="text-sm text-constalib-dark-gray">{location.locationText || 'Lieu non spécifié'}</p>
      {location.address && (
        <p className="text-xs text-constalib-dark-gray mt-1">
          Adresse géolocalisée: {location.address}
        </p>
      )}
      {location.coordinates && (
        <p className="text-xs text-constalib-dark-gray mt-1">
          Coordonnées: {location.coordinates.lat}, {location.coordinates.lng}
        </p>
      )}
    </ReviewCard>
  );
};

export default LocationCard;
