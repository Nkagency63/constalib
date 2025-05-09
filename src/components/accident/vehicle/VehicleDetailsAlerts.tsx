
import React from 'react';
import { CheckCircle2, AlertCircle, Car } from 'lucide-react';
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
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Véhicule identifié via FVA</AlertTitle>
        <AlertDescription className="text-green-800">
          {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
        </AlertDescription>
      </Alert>
    );
  }
  
  // Show success alert for SIV lookup
  if (lookupSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Véhicule identifié via SIV</AlertTitle>
        <AlertDescription className="text-green-800">
          {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
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
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default VehicleDetailsAlerts;
