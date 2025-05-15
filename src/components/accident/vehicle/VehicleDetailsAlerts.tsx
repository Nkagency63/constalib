
import React from 'react';
import { CheckCircle2, AlertCircle, Car, FileSearch, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VehicleData } from '../types/vehicleTypes';

interface VehicleDetailsAlertsProps {
  lookupSuccess: boolean;
  fniLookupSuccess: boolean;
  fvaLookupSuccess: boolean;
  vehicleDetails: VehicleData | null;
}

const VehicleDetailsAlerts = ({
  lookupSuccess,
  fniLookupSuccess,
  fvaLookupSuccess,
  vehicleDetails
}: VehicleDetailsAlertsProps) => {
  // Don't show anything if there's no vehicle data
  if (!vehicleDetails) return null;
  
  // Show success alert for FVA lookup (highest priority)
  if (fvaLookupSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <FileSearch className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Véhicule identifié via FVA</AlertTitle>
        <AlertDescription className="text-green-800">
          <div className="flex flex-col space-y-1">
            <p className="font-medium">{vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})</p>
            <p className="text-xs">✓ Informations du véhicule vérifiées</p>
            <p className="text-xs">✓ Informations d'assurance vérifiées</p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Show success alert for SIV lookup
  if (lookupSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Car className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Véhicule identifié via SIV</AlertTitle>
        <AlertDescription className="text-green-800">
          {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
          <p className="text-xs mt-1">Pour des informations d'assurance complètes, utilisez la recherche FVA.</p>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Show success alert for FNI lookup
  if (fniLookupSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Véhicule identifié via FNI</AlertTitle>
        <AlertDescription className="text-green-800">
          {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
          <p className="text-xs mt-1">Pour des informations d'assurance complètes, utilisez la recherche FVA.</p>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default VehicleDetailsAlerts;
