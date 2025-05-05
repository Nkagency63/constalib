
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Type definitions to standardize the parameters
type ReportData = {
  date: string;
  time: string;
  location: string;
  personalEmail: string;
  hasInjuries?: boolean;
  injuriesDescription?: string;
  hasMaterialDamage?: boolean;
  materialDamageDescription?: string;
};

type VehicleData = {
  licensePlate: string;
  brand: string;
  model: string;
  insuranceCompany?: string;
  insurancePolicy?: string;
};

type CircumstancesData = {
  vehicleA: string[];
  vehicleB: string[];
};

type GeolocationData = {
  lat: number | null;
  lng: number | null;
  address: string;
};

type AdditionalData = {
  participants: {
    driverA: {
      name?: string;
      address?: string;
      phone?: string;
      license?: string;
    };
    driverB: {
      name?: string;
      address?: string;
      phone?: string;
      license?: string;
    };
    insuredA: {
      name?: string;
      address?: string;
      phone?: string;
      email?: string;
    };
    insuredB: {
      name?: string;
      address?: string;
      phone?: string;
      email?: string;
    };
    witnesses?: Array<{ fullName: string; phone: string; email: string }>;
    injuries?: Array<{ name: string; contact: string }>;
  };
  signatureData: {
    partyA: string | null;
    partyB: string | null;
    timestamp: string;
  };
};

/**
 * Registers an official accident report with the backend service
 */
export const registerOfficialReport = async (
  reportData: ReportData,
  vehicleA: VehicleData,
  vehicleB: VehicleData,
  circumstances: CircumstancesData,
  geolocation: GeolocationData,
  additionalData: AdditionalData
) => {
  try {
    console.log("Registering official accident report...");
    
    // Generate a unique reference ID for this report
    const referenceId = "CR-" + uuidv4().substring(0, 8);
    
    // In a real implementation, this would call a server endpoint
    // For now, we'll just simulate successful registration
    console.log("Report data:", reportData);
    console.log("Vehicle A:", vehicleA);
    console.log("Vehicle B:", vehicleB);
    console.log("Circumstances:", circumstances);
    console.log("Geolocation:", geolocation);
    console.log("Additional data:", additionalData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success with the reference ID
    return {
      success: true,
      referenceId
    };
  } catch (error: any) {
    console.error("Error registering official report:", error);
    return {
      success: false,
      error: error.message || "Failed to register report"
    };
  }
};
