
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

export interface OtherVehicleCardProps {
  vehicle: Vehicle;
  driverName?: string;
  insuredName?: string;
}

const OtherVehicleCard = ({ vehicle, driverName, insuredName }: OtherVehicleCardProps) => {
  if (!vehicle || (!vehicle.brand && !vehicle.licensePlate)) {
    return (
      <ReviewCard icon={<Car className="h-5 w-5 text-constalib-gray" />} title="Véhicule B (tiers)">
        <div className="text-sm text-constalib-dark-gray">
          <p>Aucune information sur le véhicule tiers</p>
        </div>
      </ReviewCard>
    );
  }

  return (
    <ReviewCard icon={<Car className="h-5 w-5 text-constalib-blue" />} title="Véhicule B (tiers)">
      <div className="space-y-1">
        <p className="text-sm font-medium text-constalib-dark">
          {vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
        </p>
        {vehicle.licensePlate && (
          <p className="text-sm text-constalib-dark-gray">
            <span className="font-medium">Immatriculation:</span> {vehicle.licensePlate}
          </p>
        )}
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

export default OtherVehicleCard;
