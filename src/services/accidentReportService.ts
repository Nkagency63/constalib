
import { FormData } from '@/components/accident/types';
import { supabase } from '@/integrations/supabase/client';

export const uploadPhotos = async (files: File[], prefix: string) => {
  const uploadedFileUrls: string[] = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('accident_photos')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload ${prefix} photo: ${error.message}`);
    }
    
    uploadedFileUrls.push(filePath);
  }
  
  return uploadedFileUrls;
};

export const saveVehicleData = async (vehicleData: {
  license_plate: string,
  brand: string,
  model: string,
  year: string,
  first_registration?: string,
  insurance_policy?: string,
  insurance_company?: string
}) => {
  if (!vehicleData.license_plate) {
    return null; // No vehicle data to save
  }

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .upsert({
        license_plate: vehicleData.license_plate,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        first_registration: vehicleData.first_registration,
        insurance_policy: vehicleData.insurance_policy,
        insurance_company: vehicleData.insurance_company
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving vehicle data:', error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Error in saving vehicle:', err);
    return null;
  }
};

export const sendEmails = async (reportId: string, formData: FormData) => {
  const allRecipients = [
    ...formData.insuranceEmails,
    ...formData.involvedPartyEmails
  ];
  
  if (formData.personalEmail) {
    allRecipients.push(formData.personalEmail);
  }
  
  if (allRecipients.length === 0) {
    console.log("No recipients specified, skipping email sending");
    return;
  }
  
  try {
    const vehicleInfo = `${formData.vehicleBrand} ${formData.vehicleModel} (${formData.vehicleYear}), Immatriculation: ${formData.licensePlate}, Assurance: ${formData.insuranceCompany || 'Non spécifiée'}, N° de police: ${formData.insurancePolicy || 'Non spécifié'}`;
    
    const otherVehicleInfo = `${formData.otherVehicle.brand} ${formData.otherVehicle.model} (${formData.otherVehicle.year}), Immatriculation: ${formData.otherVehicle.licensePlate}, Assurance: ${formData.otherVehicle.insuranceCompany || 'Non spécifiée'}, N° de police: ${formData.otherVehicle.insurancePolicy || 'Non spécifié'}`;
    
    const { data, error } = await supabase.functions.invoke('send-accident-report', {
      body: {
        to: allRecipients,
        subject: `Constat Amiable d'Accident - Ref: ${reportId}`,
        reportId,
        reportData: formData,
        vehicleInfo,
        otherVehicleInfo,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        description: formData.description,
        hasPhotos: formData.vehiclePhotos.length > 0 || formData.damagePhotos.length > 0
      }
    });
    
    if (error) {
      console.error("Error sending emails:", error);
      throw new Error(error.message);
    }
    
    console.log("Emails sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in sendEmails function:", error);
    throw error;
  }
};

export const saveAccidentReport = async (formData: FormData, vehicleId: string | null, otherVehicleId: string | null, vehiclePhotoUrls: string[], damagePhotoUrls: string[]) => {
  const { data, error } = await supabase
    .from('accident_reports')
    .insert({
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      vehicle_photos: vehiclePhotoUrls,
      damage_photos: damagePhotoUrls,
      vehicle_id: vehicleId,
      other_vehicle_id: otherVehicleId,
      geolocation_lat: formData.geolocation.lat,
      geolocation_lng: formData.geolocation.lng,
      geolocation_address: formData.geolocation.address,
      emergency_contacted: formData.emergencyContacted,
      vehicle_insurance_policy: formData.insurancePolicy,
      vehicle_insurance_company: formData.insuranceCompany,
      other_vehicle_insurance_policy: formData.otherVehicle.insurancePolicy,
      other_vehicle_insurance_company: formData.otherVehicle.insuranceCompany
    })
    .select();
    
  if (error) {
    throw new Error(`Failed to save accident report: ${error.message}`);
  }
  
  return data;
};

// Nouvelle fonction pour enregistrer un rapport officiel via la fonction Edge
export const registerOfficialReport = async (
  reportData: any,
  vehicleA: any,
  vehicleB: any,
  circumstances: any,
  geolocation: any,
  signatureData?: {
    partyA: string | null;
    partyB: string | null;
    timestamp: string;
  }
) => {
  try {
    const { data, error } = await supabase.functions.invoke('register-accident-report', {
      body: {
        reportData,
        vehicleA,
        vehicleB,
        circumstances,
        geolocation,
        signatureData
      }
    });

    if (error) {
      console.error("Erreur lors de l'enregistrement officiel:", error);
      throw new Error(error.message || "Erreur lors de l'enregistrement officiel");
    }

    return data;
  } catch (error: any) {
    console.error("Erreur lors de l'appel à la fonction Edge:", error);
    throw new Error(error.message || "Erreur lors de l'enregistrement officiel");
  }
};
