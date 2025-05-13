
import { Car } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface Vehicle {
  licensePlate?: string;
  brand?: string;
  model?: string;
  year?: string;
  description?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  driverName?: string;
  insuredName?: string;
}

const VehicleCard = ({ vehicle, driverName, insuredName }: VehicleCardProps) => {
  return (
    <ReviewCard icon={<Car className="h-5 w-5 text-constalib-blue" />} title="Véhicule A (conducteur principal)">
      <div className="space-y-1">
        <p className="text-sm font-medium text-constalib-dark">
          {vehicle.brand} {vehicle.model} ({vehicle.year || 'Année inconnue'})
        </p>
        <p className="text-sm text-constalib-dark-gray">
          <span className="font-medium">Immatriculation:</span> {vehicle.licensePlate}
        </p>
        {driverName && (
          <p className="text-sm text-constalib-dark-gray">
            <span className="font-medium">Conducteur:</span> {driverName}
          </p>
        )}
        {insuredName && (
          <p className="text-sm text-constalib-dark-gray">
            <span className="font-medium">Assuré:</span> {insuredName}
          </p>
        )}
        {vehicle.insuranceCompany && (
          <p className="text-sm text-constalib-dark-gray">
            <span className="font-medium">Assurance:</span> {vehicle.insuranceCompany}
            {vehicle.insurancePolicy && ` (Police n° ${vehicle.insurancePolicy})`}
          </p>
        )}
      </div>
    </ReviewCard>
  );
};

export default VehicleCard;
