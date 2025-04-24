
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { 
  createResponse, 
  handleError, 
  normalizeLicensePlate, 
  simulateApiDelay, 
  filterSensitiveVehicleData 
} from '../_shared/vehicle-utils.ts';

// Simulated FNI database (French National Vehicle Registration database)
// This simulates the old registration format (before 2009)
const fniFrenchVehicleDatabase = {
  // Old format (3 numbers + 3 letters + department number)
  '123ABC75': { 
    brand: 'Renault', 
    model: 'Twingo', 
    year: '2002', 
    owner: 'REDACTED', 
    firstRegistration: '2002-06-18', 
    status: 'active',
    insurance: {
      company: 'MAIF',
      policy: 'M98765432',
      name: 'Auto Tous Risques'
    }
  },
  '456DEF92': { 
    brand: 'Peugeot', 
    model: '206', 
    year: '2003', 
    owner: 'REDACTED', 
    firstRegistration: '2003-04-22', 
    status: 'active',
    insurance: {
      company: 'Groupama',
      policy: 'G45678901',
      name: 'Auto Référence'
    }
  },
  '789GHI69': { 
    brand: 'Citroen', 
    model: 'C3', 
    year: '2004', 
    owner: 'REDACTED', 
    firstRegistration: '2004-09-15', 
    status: 'active',
    insurance: {
      company: 'Allianz',
      policy: 'A87654321',
      name: 'Auto Sur Mesure'
    }
  },
  '234JKL33': { 
    brand: 'Renault', 
    model: 'Clio', 
    year: '2000', 
    owner: 'REDACTED', 
    firstRegistration: '2000-03-10', 
    status: 'active',
    insurance: {
      company: 'AXA',
      policy: 'AX12345678',
      name: 'Auto Confort'
    }
  },
  '567MNO13': { 
    brand: 'Peugeot', 
    model: '307', 
    year: '2005', 
    owner: 'REDACTED', 
    firstRegistration: '2005-11-25', 
    status: 'active',
    insurance: {
      company: 'MMA',
      policy: 'MM87654321',
      name: 'Auto Tous Risques Plus'
    }
  },
  '890PQR59': { 
    brand: 'Citroen', 
    model: 'C4', 
    year: '2006', 
    owner: 'REDACTED', 
    firstRegistration: '2006-07-30', 
    status: 'active',
    insurance: {
      company: 'GMF',
      policy: 'GM12345678',
      name: 'Auto Pass'
    }
  },
  '345STU44': { 
    brand: 'Renault', 
    model: 'Megane', 
    year: '2001', 
    owner: 'REDACTED', 
    firstRegistration: '2001-01-14', 
    status: 'active',
    insurance: {
      company: 'Direct Assurance',
      policy: 'DA87654321',
      name: 'Auto Eco'
    }
  },
  '678VWX75': { 
    brand: 'Peugeot', 
    model: '407', 
    year: '2007', 
    owner: 'REDACTED', 
    firstRegistration: '2007-05-19', 
    status: 'active',
    insurance: {
      company: 'MACIF',
      policy: 'MAC12345678',
      name: 'Auto Tous Risques'
    }
  },
  // Also support without department number for flexibility
  '123ABC': { 
    brand: 'Renault', 
    model: 'Twingo', 
    year: '2002', 
    owner: 'REDACTED', 
    firstRegistration: '2002-06-18', 
    status: 'active',
    insurance: {
      company: 'MAIF',
      policy: 'M98765432',
      name: 'Auto Tous Risques'
    }
  },
  '456DEF': { 
    brand: 'Peugeot', 
    model: '206', 
    year: '2003', 
    owner: 'REDACTED', 
    firstRegistration: '2003-04-22', 
    status: 'active',
    insurance: {
      company: 'Groupama',
      policy: 'G45678901',
      name: 'Auto Référence'
    }
  },
  '789GHI': { 
    brand: 'Citroen', 
    model: 'C3', 
    year: '2004', 
    owner: 'REDACTED', 
    firstRegistration: '2004-09-15', 
    status: 'active',
    insurance: {
      company: 'Allianz',
      policy: 'A87654321',
      name: 'Auto Sur Mesure'
    }
  },
};

serve(async (req) => {
  // Handle CORS for OPTIONS requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { licensePlate } = await req.json();
    
    // Normalize the license plate for FNI format
    const normalizedPlate = normalizeLicensePlate(licensePlate, 'fni');
    
    console.log(`Recherche de véhicule dans le FNI avec plaque: ${normalizedPlate}`);
    
    // First search with department if present
    let vehicleData = fniFrenchVehicleDatabase[normalizedPlate];
    
    // If not found and appears to be in 123ABC75 format, try without department
    if (!vehicleData && /^[0-9]{3}[A-Z]{3}[0-9]{1,2}$/.test(normalizedPlate)) {
      const withoutDepartment = normalizedPlate.substring(0, 6);
      vehicleData = fniFrenchVehicleDatabase[withoutDepartment];
      console.log(`Essai sans département: ${withoutDepartment}`);
    }
    
    if (!vehicleData) {
      console.log(`Véhicule non trouvé dans le FNI: ${normalizedPlate}`);
      return createResponse({ 
        success: false,
        error: 'Vehicle not found in FNI',
        message: 'Aucun véhicule trouvé avec cette immatriculation dans le FNI',
        status: 'not_found'
      }, 404);
    }
    
    // Simulate API delay
    await simulateApiDelay(200, 600);
    
    console.log(`Véhicule trouvé dans FNI: ${JSON.stringify(vehicleData)}`);
    
    // Filter sensitive data before returning
    const publicData = filterSensitiveVehicleData(vehicleData);
    
    // Add source information
    publicData.source = "FNI";
    
    return createResponse({ 
      success: true,
      data: publicData,
      message: 'Véhicule identifié avec succès dans le FNI'
    });
  } catch (error) {
    return handleError(error, 'Erreur lors de la consultation du FNI');
  }
});
