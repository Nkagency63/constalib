
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

interface DriverInfo {
  name?: string;
  address?: string;
  phone?: string;
  license?: string;
}

interface InsuredInfo {
  name?: string;
  address?: string;
  phone?: string;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  driver?: DriverInfo;
  insured?: InsuredInfo;
}

const VehicleCard = ({ vehicle, driver, insured }: VehicleCardProps) => {
  return (
    <ReviewCard icon={<Car className="h-5 w-5 text-constalib-blue" />} title="Véhicule A (conducteur principal)">
      <div className="space-y-1">
        <p className="text-sm font-medium text-constalib-dark">
          {vehicle.brand} {vehicle.model} ({vehicle.year || 'Année inconnue'})
        </p>
        <p className="text-sm text-constalib-dark-gray">
          <span className="font-medium">Immatriculation:</span> {vehicle.licensePlate}
        </p>
        
        {driver?.name && (
          <div className="mt-2">
            <p className="text-sm font-medium text-constalib-dark">Conducteur:</p>
            <p className="text-sm text-constalib-dark-gray">{driver.name}</p>
            {driver.address && <p className="text-xs text-constalib-dark-gray">{driver.address}</p>}
            {driver.phone && <p className="text-xs text-constalib-dark-gray">Tél: {driver.phone}</p>}
            {driver.license && <p className="text-xs text-constalib-dark-gray">Permis n°: {driver.license}</p>}
          </div>
        )}
        
        {insured?.name && (
          <div className="mt-2">
            <p className="text-sm font-medium text-constalib-dark">Assuré:</p>
            <p className="text-sm text-constalib-dark-gray">{insured.name}</p>
            {insured.address && <p className="text-xs text-constalib-dark-gray">{insured.address}</p>}
            {insured.phone && <p className="text-xs text-constalib-dark-gray">Tél: {insured.phone}</p>}
          </div>
        )}
        
        {vehicle.insuranceCompany && (
          <div className="mt-2">
            <p className="text-sm font-medium text-constalib-dark">Assurance:</p>
            <p className="text-sm text-constalib-dark-gray">
              {vehicle.insuranceCompany}
              {vehicle.insurancePolicy && ` (Police n° ${vehicle.insurancePolicy})`}
            </p>
          </div>
        )}
      </div>
    </ReviewCard>
  );
};

export default VehicleCard;
