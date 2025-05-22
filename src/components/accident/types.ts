
export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface VehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  description: string;
  firstRegistration?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
}

export interface FormData {
  date: string;
  time: string;
  location: string;
  description: string;
  // Section 1: Nouvelles informations de base
  weatherConditions: string;
  injuredPersons: boolean;
  witnesses: Witness[];
  // Photos
  vehiclePhotos: File[];
  damagePhotos: File[];
  // Premier véhicule (le vôtre)
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  firstRegistration?: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
  // Informations sur le propriétaire et le conducteur
  ownerName: string;
  ownerFirstName: string;
  ownerAddress: string;
  driverName: string;
  driverFirstName: string;
  driverLicenseNumber: string;
  driverLicenseDate: string;
  driverLicenseCountry: string;
  // Second véhicule (l'autre impliqué)
  otherVehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    description: string;
    firstRegistration?: string;
    insurancePolicy?: string;
    insuranceCompany?: string;
    // Informations sur le propriétaire et le conducteur
    ownerName: string;
    ownerFirstName: string;
    ownerAddress: string;
    driverName: string;
    driverFirstName: string;
    driverLicenseNumber: string;
    driverLicenseDate: string;
    driverLicenseCountry: string;
  };
  // Circonstances
  circumstancesA: number[];
  circumstancesB: number[];
  observations: string;
  disagreement: boolean;
  geolocation: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  emergencyContacted: boolean;
  // Signatures
  signatureA: string;
  signatureB: string;
  signatureDateA: string;
  signatureDateB: string;
  // Informations d'email
  personalEmail: string;
  insuranceEmails: string[];
  involvedPartyEmails: string[];
}

export interface Witness {
  id: string;
  name: string;
  contact: string;
}
