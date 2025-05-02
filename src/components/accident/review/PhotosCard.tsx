
import { Image } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface PhotosCardProps {
  vehiclePhotos: File[];
  damagePhotos: File[];
}

const PhotosCard = ({ vehiclePhotos, damagePhotos }: PhotosCardProps) => {
  return (
    <ReviewCard icon={<Image className="h-5 w-5 text-constalib-blue" />} title="Photos">
      <p className="text-sm text-constalib-dark-gray">
        <span className="font-medium">Photos du véhicule:</span> {vehiclePhotos.length} photo(s)
      </p>
      <p className="text-sm text-constalib-dark-gray">
        <span className="font-medium">Photos des dégâts:</span> {damagePhotos.length} photo(s)
      </p>
    </ReviewCard>
  );
};

export default PhotosCard;
