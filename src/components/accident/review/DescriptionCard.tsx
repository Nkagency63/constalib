
import { FileText } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface DescriptionCardProps {
  description: string;
}

const DescriptionCard = ({ description }: DescriptionCardProps) => {
  return (
    <ReviewCard icon={<FileText className="h-5 w-5 text-constalib-blue" />} title="Description de l'accident">
      <p className="text-sm text-constalib-dark-gray">{description || "Aucune description fournie"}</p>
    </ReviewCard>
  );
};

export default DescriptionCard;
