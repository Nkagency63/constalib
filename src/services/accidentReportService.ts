
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
  year?: string;
  first_registration?: string;
  insuranceCompany?: string;
  insurancePolicy?: string;
  description?: string;
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

// Function to save vehicle data
export const saveVehicleData = async (vehicleData: VehicleData) => {
  try {
    console.log("Saving vehicle data:", vehicleData);
    
    // Generate a UUID for the vehicle
    const vehicleId = uuidv4();
    
    // In a real implementation, this would save to a database
    // For now we'll just simulate successful registration
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return vehicleId;
  } catch (error: any) {
    console.error("Error saving vehicle data:", error);
    throw new Error("Failed to save vehicle data: " + error.message);
  }
};

// Function to upload photos
export const uploadPhotos = async (photos: File[], type: 'vehicle' | 'damage') => {
  try {
    console.log(`Uploading ${photos.length} ${type} photos`);
    
    // In a real implementation, this would upload to storage
    // For now we'll just simulate successful upload
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock URLs for the uploaded photos
    return photos.map((_, index) => `https://mock-url.com/${type}-photo-${index}.jpg`);
  } catch (error: any) {
    console.error("Error uploading photos:", error);
    throw new Error("Failed to upload photos: " + error.message);
  }
};

// Function to save the complete accident report
export const saveAccidentReport = async (
  formData: any,
  vehicleId: string,
  otherVehicleId: string,
  vehiclePhotoUrls: string[],
  damagePhotoUrls: string[]
) => {
  try {
    console.log("Saving accident report:", formData);
    
    // In a real implementation, this would save to a database
    // For now we'll just simulate successful registration
    const reportId = uuidv4();
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Return a mock report object
    return [{
      id: reportId,
      vehicle_id: vehicleId,
      other_vehicle_id: otherVehicleId,
      created_at: new Date().toISOString(),
      // More properties would be stored in a real implementation
    }];
  } catch (error: any) {
    console.error("Error saving accident report:", error);
    throw new Error("Failed to save accident report: " + error.message);
  }
};

// Function to send email notifications
export const sendEmails = async (reportId: string, formData: any) => {
  try {
    console.log("Sending emails for report:", reportId);
    console.log("Recipients:", formData.personalEmail, formData.insuranceEmails, formData.involvedPartyEmails);
    
    // In a real implementation, this would send emails
    // For now we'll just simulate successful sending
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return true;
  } catch (error: any) {
    console.error("Error sending emails:", error);
    throw new Error("Failed to send emails: " + error.message);
  }
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
