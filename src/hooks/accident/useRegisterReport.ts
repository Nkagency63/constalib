
import { useState } from 'react';
import { toast } from "sonner";
import { FormData, Circumstance, CircumstancesData, InjuryInfo } from "@/components/accident/types";
import { registerOfficialReport } from "@/services/accidentReportService";
import { GeolocationData } from "@/hooks/accident/useLocationForm";

interface UseRegisterReportProps {
  formData: FormData;
  signatures: {
    partyA: string | null;
    partyB: string | null;
  };
}

// Interface to match expected service format for injuries
interface ServiceInjuryInfo {
  name: string;
  contact: string;
  severity?: string;
  description?: string;
}

export const useRegisterReport = ({ formData, signatures }: UseRegisterReportProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOfficialDialog, setShowOfficialDialog] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const handleRegisterOfficial = async (schemeImageDataUrl: string | null = null) => {
    if (!signatures?.partyA || !signatures?.partyB) {
      toast.error("Les deux signatures sont nécessaires pour l'enregistrement officiel");
      return;
    }
    
    setIsRegistering(true);
    try {
      // Prepare data for official registration - organizing it according to the expected parameters
      const reportData = {
        date: formData.date,
        time: formData.time,
        location: formData.location,
        personalEmail: formData.personalEmail,
        hasInjuries: formData.hasInjuries,
        injuriesDescription: formData.injuriesDescription,
        hasMaterialDamage: formData.hasMaterialDamage,
        materialDamageDescription: formData.materialDamageDescription
      };

      const vehicleA = {
        licensePlate: formData.licensePlate,
        brand: formData.vehicleBrand,
        model: formData.vehicleModel,
        insuranceCompany: formData.insuranceCompany,
        insurancePolicy: formData.insurancePolicy
      };

      const vehicleB = {
        licensePlate: formData.otherVehicle.licensePlate,
        brand: formData.otherVehicle.brand,
        model: formData.otherVehicle.model,
        insuranceCompany: formData.otherVehicle.insuranceCompany,
        insurancePolicy: formData.otherVehicle.insurancePolicy
      };

      // Adapt injuries to match expected service format
      const adaptedInjuries: ServiceInjuryInfo[] = (formData.injuries || []).map((injury: InjuryInfo) => ({
        name: injury.name,
        contact: "N/A", // Add the required contact field with placeholder
        severity: injury.severity,
        description: injury.description
      }));

      // Compile all participant information
      const participants = {
        driverA: {
          name: formData.driverName || "",
          address: formData.driverAddress || "",
          phone: formData.driverPhone || "",
          license: formData.driverLicense || ""
        },
        driverB: {
          name: formData.otherDriverName || "",
          address: formData.otherDriverAddress || "",
          phone: formData.otherDriverPhone || "",
          license: formData.otherDriverLicense || ""
        },
        insuredA: {
          name: formData.insuredName || "",
          address: formData.insuredAddress || "",
          phone: formData.insuredPhone || "",
          email: formData.personalEmail || ""
        },
        insuredB: {
          name: formData.otherInsuredName || "",
          address: formData.otherInsuredAddress || "",
          phone: formData.otherInsuredPhone || "",
          email: formData.otherInsuredEmail || ""
        },
        witnesses: formData.witnesses?.map((witness: any) => ({
          fullName: witness.name || witness.fullName || "",
          phone: witness.phone || "",
          email: witness.email || ""
        })) || [],
        injuries: adaptedInjuries
      };

      // Format circumstances data - extract IDs from Circumstance objects
      const circumstancesData: CircumstancesData = {
        vehicleA: (formData.vehicleACircumstances || []).map((circ: Circumstance) => circ.id),
        vehicleB: (formData.vehicleBCircumstances || []).map((circ: Circumstance) => circ.id)
      };

      // Create a properly typed geolocation object with all required properties
      const geolocation: GeolocationData = {
        lat: formData.geolocation.lat || 0,
        lng: formData.geolocation.lng || 0,
        address: formData.geolocation.address || "",
        // Set default values for optional properties
        accuracy: formData.geolocation.accuracy || 0,
        timestamp: formData.geolocation.timestamp || Date.now()
      };
      
      const signatureData = {
        partyA: signatures.partyA,
        partyB: signatures.partyB,
        timestamp: new Date().toISOString()
      };
      
      // Call the official registration function with the consolidated data structure
      const result = await registerOfficialReport(
        reportData, 
        vehicleA, 
        vehicleB, 
        circumstancesData, 
        geolocation,
        {
          participants,
          signatureData,
          schemeImage: schemeImageDataUrl // Properly named parameter
        }
      );
      
      if (result.success) {
        setReferenceId(result.referenceId);
        setShowOfficialDialog(true);
        toast.success("Constat enregistré officiellement");
      } else {
        throw new Error(result.error || "Failed to register official report");
      }
    } catch (error: any) {
      console.error("Error registering official report:", error);
      toast.error(error.message || "Error registering official report");
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isRegistering,
    showOfficialDialog,
    setShowOfficialDialog,
    referenceId,
    handleRegisterOfficial
  };
};
