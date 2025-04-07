
import { VehicleData } from '../types/vehicleTypes';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, FileText } from 'lucide-react';

interface VehicleDetailsAlertsProps {
  lookupSuccess: boolean;
  fniLookupSuccess: boolean;
  vehicleDetails: VehicleData | null;
}

const VehicleDetailsAlerts = ({ 
  lookupSuccess, 
  fniLookupSuccess, 
  vehicleDetails 
}: VehicleDetailsAlertsProps) => {
  if (!vehicleDetails) return null;
  
  return (
    <>
      {lookupSuccess && vehicleDetails && !fniLookupSuccess && (
        <Alert className="mt-2 border-green-200 bg-green-50">
          <Car className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Véhicule identifié dans le SIV : {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
            {vehicleDetails.firstRegistration && 
              <div className="text-xs mt-1">Date de première immatriculation : {vehicleDetails.firstRegistration}</div>
            }
          </AlertDescription>
        </Alert>
      )}
      
      {fniLookupSuccess && vehicleDetails && (
        <Alert className="mt-2 border-amber-200 bg-amber-50">
          <FileText className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Véhicule identifié dans le FNI : {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
            {vehicleDetails.firstRegistration && 
              <div className="text-xs mt-1">Date de première immatriculation : {vehicleDetails.firstRegistration}</div>
            }
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default VehicleDetailsAlerts;
