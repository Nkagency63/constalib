
import { Check } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface EmergencyCardProps {
  emergencyContacted: boolean;
}

const EmergencyCard = ({ emergencyContacted }: EmergencyCardProps) => {
  if (!emergencyContacted) return null;
  
  return (
    <ReviewCard icon={<Check className="h-5 w-5 text-green-500" />} title="Secours contactés">
      <p className="text-sm text-constalib-dark-gray">Vous avez indiqué avoir contacté les services d'urgence.</p>
    </ReviewCard>
  );
};

export default EmergencyCard;
