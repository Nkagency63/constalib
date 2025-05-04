
import { FileText } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { WitnessInfo } from '../types';

interface DescriptionCardProps {
  description: string;
  hasInjuries?: boolean;
  injuriesDescription?: string;
  hasWitnesses?: boolean;
  witnesses?: WitnessInfo[];
}

const DescriptionCard = ({ 
  description, 
  hasInjuries, 
  injuriesDescription,
  hasWitnesses,
  witnesses
}: DescriptionCardProps) => {
  return (
    <ReviewCard icon={<FileText className="h-5 w-5 text-constalib-blue" />} title="Description de l'accident">
      <div className="space-y-3">
        <div>
          <p className="text-sm text-constalib-dark-gray">{description || "Aucune description fournie"}</p>
        </div>
        
        {hasInjuries && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-constalib-dark">Blessés</h4>
            <p className="text-sm text-constalib-dark-gray">{injuriesDescription || "Des blessés ont été signalés"}</p>
          </div>
        )}
        
        {hasWitnesses && witnesses && witnesses.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-constalib-dark">Témoins</h4>
            <ul className="text-sm text-constalib-dark-gray">
              {witnesses.map((witness, index) => (
                <li key={index}>
                  {witness.fullName} {witness.phone && `- ${witness.phone}`} {witness.email && `- ${witness.email}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ReviewCard>
  );
};

export default DescriptionCard;
