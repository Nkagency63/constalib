
import { corsHeaders } from './cors.ts';

// Standardized response format
export interface VehicleResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: string;
}

// Helper function to standardize response creation
export function createResponse<T>(
  data: VehicleResponse<T>, 
  status: number = 200
): Response {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status 
    }
  );
}

// Helper function to handle errors consistently
export function handleError(error: Error, errorMessage: string): Response {
  console.error(`Error: ${error.message}`);
  return createResponse({
    success: false,
    error: error.message,
    message: errorMessage
  }, 400);
}

// Function to normalize license plates for consistent lookups
export function normalizeLicensePlate(licensePlate: string, format: 'siv' | 'fni' = 'siv'): string {
  if (format === 'siv') {
    // For SIV format (new style AA-123-BB), remove spaces and dashes
    return licensePlate.replace(/[\s-]+/g, '').toUpperCase();
  } else {
    // For FNI format (old style 123 ABC 75), just remove spaces
    return licensePlate.replace(/\s+/g, '').toUpperCase();
  }
}

// Simulate a realistic API delay
export async function simulateApiDelay(minMs = 200, maxMs = 500): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Helper to filter sensitive information from vehicle data
export function filterSensitiveVehicleData(vehicleData: any): any {
  if (!vehicleData) return null;
  
  return {
    brand: vehicleData.brand,
    model: vehicleData.model,
    year: vehicleData.year,
    firstRegistration: vehicleData.firstRegistration,
    insurance: vehicleData.insurance ? {
      company: vehicleData.insurance.company,
      policy: vehicleData.insurance.policy,
      name: vehicleData.insurance.name
    } : null
  };
}
