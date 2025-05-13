export interface VehicleData {
  brand: string;
  model: string;
  year?: string;
  firstRegistration?: string;
  insurance?: {
    company: string;
    policy: string;
    name: string;
  };
  source?: string;
  licensePlate?: string;
  insuranceCompany?: string;
  insurancePolicy?: string;
  description?: string;
}

export interface InsuranceData {
  company: string;
  name?: string;
  logo?: string;
}

export interface FvaData {
  vehicleInfo: {
    licensePlate: string;
    brand: string;
    model: string;
    vin: string;
    firstRegistration: string;
  };
  insuranceInfo: {
    company: string;
    policyNumber: string;
    contractName: string;
    validFrom: string;
    validUntil: string;
    guarantees: string[];
    insuredName: string;
    insuredAddress: string;
    insuredPhone: string;
    insuredEmail: string;
  };
}

// Interface for error responses to better handle errors
export interface LookupError {
  status: number;
  message: string;
}
