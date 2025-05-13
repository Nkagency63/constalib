
import { MapPin } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface LocationCardProps {
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

const LocationCard = ({ location, address, latitude, longitude }: LocationCardProps) => {
  return (
    <ReviewCard icon={<MapPin className="h-5 w-5 text-constalib-blue" />} title="Lieu de l'accident">
      <p className="text-sm text-constalib-dark-gray">{location}</p>
      {address && (
        <p className="text-xs text-constalib-dark-gray mt-1">
          Adresse géolocalisée: {address}
        </p>
      )}
    </ReviewCard>
  );
};

export default LocationCard;
