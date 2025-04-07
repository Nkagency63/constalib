
import { VehicleData } from '../types/vehicleTypes';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, FileText, Shield } from 'lucide-react';

interface VehicleDetailsAlertsProps {
  lookupSuccess: boolean;
  fniLookupSuccess: boolean;
  fvaLookupSuccess?: boolean;
  vehicleDetails: VehicleData | null;
}

const VehicleDetailsAlerts = ({ 
  lookupSuccess, 
  fniLookupSuccess, 
  fvaLookupSuccess,
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

      {fvaLookupSuccess && (
        <Alert className="mt-2 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Véhicule et assurance identifiés dans le FVA : {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
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
