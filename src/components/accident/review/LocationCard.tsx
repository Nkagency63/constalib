
import { MapPin } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface LocationCardProps {
  location: string;
  geolocation: {
    address: string;
    lat: number | null;
    lng: number | null;
  };
}

const LocationCard = ({ location, geolocation }: LocationCardProps) => {
  return (
    <ReviewCard icon={<MapPin className="h-5 w-5 text-constalib-blue" />} title="Lieu de l'accident">
      <p className="text-sm text-constalib-dark-gray">{location}</p>
      {geolocation.address && (
        <p className="text-xs text-constalib-dark-gray mt-1">
          Adresse géolocalisée: {geolocation.address}
        </p>
      )}
    </ReviewCard>
  );
};

export default LocationCard;
