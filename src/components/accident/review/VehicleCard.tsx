
import { Car, FileCheck } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { FormData } from '../types';

export interface VehicleCardProps {
  formData: FormData;
}

const VehicleCard = ({ formData }: VehicleCardProps) => {
  return (
    <ReviewCard icon={<Car className="h-5 w-5 text-constalib-blue" />} title="Véhicule A (conducteur principal)">
      <div className="space-y-1">
        <p className="text-sm font-medium text-constalib-dark">
          {formData.vehicleBrand} {formData.vehicleModel} ({formData.vehicleYear || 'Année inconnue'})
        </p>
        <p className="text-sm text-constalib-dark-gray">
          <span className="font-medium">Immatriculation:</span> {formData.licensePlate}
        </p>
        {formData.insuranceCompany && (
          <p className="text-sm text-constalib-dark-gray">
            <span className="font-medium">Assurance:</span> {formData.insuranceCompany}
            {formData.insurancePolicy && ` (Police n° ${formData.insurancePolicy})`}
          </p>
        )}
      </div>
    </ReviewCard>
  );
};

export default VehicleCard;
