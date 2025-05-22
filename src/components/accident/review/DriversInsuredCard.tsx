
import { DriverInfo, InsuredInfo } from '../types';
import ReviewCard from './ReviewCard';
import { User, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DriversInsuredCardProps {
  vehicleId: 'A' | 'B';
  driver: DriverInfo;
  insured: InsuredInfo;
}

const DriversInsuredCard = ({ vehicleId, driver, insured }: DriversInsuredCardProps) => {
  return (
    <ReviewCard 
      icon={<User className="h-5 w-5 text-constalib-blue" />} 
      title={`Conducteur et assuré - Véhicule ${vehicleId}`}
    >
      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-medium text-constalib-dark flex items-center gap-1 mb-1">
            <User className="h-4 w-4" /> Conducteur
          </h5>
          <div className="text-sm text-constalib-dark-gray space-y-1">
            <p><span className="font-medium">Nom:</span> {driver.fullName || "Non renseigné"}</p>
            <p><span className="font-medium">Adresse:</span> {driver.address || "Non renseignée"}</p>
            <p><span className="font-medium">N° de permis:</span> {driver.licenseNumber || "Non renseigné"}</p>
            {driver.licenseDate && (
              <p><span className="font-medium">Date du permis:</span> {driver.licenseDate}</p>
            )}
            <p><span className="font-medium">Contact:</span> {driver.phone || "Non renseigné"}{driver.email && `, ${driver.email}`}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h5 className="text-sm font-medium text-constalib-dark flex items-center gap-1 mb-1">
            <ShieldCheck className="h-4 w-4" /> Assuré
          </h5>
          <div className="text-sm text-constalib-dark-gray space-y-1">
            {insured.isDriver ? (
              <p><em>L'assuré est le conducteur</em></p>
            ) : (
              <>
                <p><span className="font-medium">Nom:</span> {insured.fullName || "Non renseigné"}</p>
                <p><span className="font-medium">Adresse:</span> {insured.address || "Non renseignée"}</p>
                <p><span className="font-medium">Contact:</span> {insured.phone || "Non renseigné"}{insured.email && `, ${insured.email}`}</p>
              </>
            )}
            <p><span className="font-medium">N° de police:</span> {insured.policyNumber || "Non renseigné"}</p>
          </div>
        </div>
      </div>
    </ReviewCard>
  );
};

export default DriversInsuredCard;
