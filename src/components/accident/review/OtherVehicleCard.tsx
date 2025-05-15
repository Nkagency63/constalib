
import { CarTaxiFront, Shield } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface OtherVehicleCardProps {
  otherVehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    description: string;
    insurancePolicy?: string;
    insuranceCompany?: string;
  };
}

const OtherVehicleCard = ({ otherVehicle }: OtherVehicleCardProps) => {
  return (
    <ReviewCard icon={<CarTaxiFront className="h-5 w-5 text-constalib-blue" />} title="Véhicule adverse">
      <p className="text-sm text-constalib-dark-gray">
        <span className="font-medium">Immatriculation:</span> {otherVehicle.licensePlate || "Non renseigné"}
      </p>
      {otherVehicle.brand && (
        <p className="text-sm text-constalib-dark-gray">
          <span className="font-medium">Marque/Modèle:</span> {otherVehicle.brand} {otherVehicle.model} ({otherVehicle.year})
        </p>
      )}
      {otherVehicle.description && (
        <p className="text-sm text-constalib-dark-gray">
          <span className="font-medium">Description:</span> {otherVehicle.description}
        </p>
      )}
      {(otherVehicle.insurancePolicy || otherVehicle.insuranceCompany) && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-constalib-dark-gray">
            <Shield className="h-4 w-4 text-constalib-blue" />
            <span className="font-medium">Assurance:</span>
          </div>
          {otherVehicle.insurancePolicy && (
            <p className="text-sm text-constalib-dark-gray ml-5">
              <span className="font-medium">N° de police:</span> {otherVehicle.insurancePolicy}
            </p>
          )}
          {otherVehicle.insuranceCompany && (
            <p className="text-sm text-constalib-dark-gray ml-5">
              <span className="font-medium">Compagnie:</span> {otherVehicle.insuranceCompany}
            </p>
          )}
        </div>
      )}
    </ReviewCard>
  );
};

export default OtherVehicleCard;
