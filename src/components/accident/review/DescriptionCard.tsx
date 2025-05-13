
import { FileText } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { FormData } from '../types';

export interface DescriptionCardProps {
  formData: FormData;
}

const DescriptionCard = ({ formData }: DescriptionCardProps) => {
  return (
    <ReviewCard icon={<FileText className="h-5 w-5 text-constalib-blue" />} title="Descriptions">
      <div className="space-y-3">
        {formData.materialDamageDescription && (
          <div>
            <h5 className="text-sm font-medium text-constalib-dark">Dommages matériels :</h5>
            <p className="text-sm text-constalib-dark-gray">{formData.materialDamageDescription}</p>
          </div>
        )}
        {formData.injuriesDescription && (
          <div>
            <h5 className="text-sm font-medium text-constalib-dark">Dommages corporels :</h5>
            <p className="text-sm text-constalib-dark-gray">{formData.injuriesDescription}</p>
          </div>
        )}
      </div>
    </ReviewCard>
  );
};

export default DescriptionCard;
