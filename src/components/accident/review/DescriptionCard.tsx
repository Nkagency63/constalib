
import React from 'react';
import { FormData } from '../types';
import ReviewCard from './ReviewCard';
import { FileText } from 'lucide-react';

interface DescriptionCardProps {
  formData: FormData;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ formData }) => {
  return (
    <ReviewCard icon={<FileText className="h-5 w-5 text-constalib-blue" />} title="Description de l'accident">
      <div className="space-y-3">
        {formData.materialDamageDescription && (
          <div>
            <span className="font-medium text-sm">Dégâts matériels:</span> 
            <p className="text-sm text-constalib-dark-gray">{formData.materialDamageDescription}</p>
          </div>
        )}
        
        {formData.injuriesDescription && (
          <div>
            <span className="font-medium text-sm">Blessures:</span> 
            <p className="text-sm text-constalib-dark-gray">{formData.injuriesDescription}</p>
          </div>
        )}
        
        {formData.witnesses?.length > 0 && (
          <div>
            <span className="font-medium text-sm">Témoins:</span>
            {formData.witnesses.map((witness, index) => (
              <div key={witness.id} className="text-sm text-constalib-dark-gray">
                Témoin {index + 1}: {witness.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </ReviewCard>
  );
};

export default DescriptionCard;
