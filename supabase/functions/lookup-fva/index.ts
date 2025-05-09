
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { 
  createResponse, 
  handleError, 
  normalizeLicensePlate, 
  simulateApiDelay 
} from '../_shared/vehicle-utils.ts';

// Simulated FVA database (Fichier des Véhicules Assurés)
const fvaDatabase = {
  'AA123BB': { 
    vehicleInfo: {
      licensePlate: 'AA-123-BB',
      brand: 'Renault',
      model: 'Clio',
      vin: 'VF1LJN00662696253',
      firstRegistration: '2018-05-15',
    },
    insuranceInfo: {
      company: 'AXA Assurances',
      policyNumber: 'A12345678',
      contractName: 'Auto Confort',
      validFrom: '2023-01-01',
      validUntil: '2024-01-01',
      guarantees: ['Responsabilité civile', 'Dommages tous accidents', 'Vol', 'Incendie', 'Bris de glace'],
      insuredName: 'Martin Dupont',
      insuredAddress: '123 Avenue des Champs-Élysées, 75008 Paris',
      insuredPhone: '+33612345678',
      insuredEmail: 'martin.dupont@example.com'
    }
  },
  'BB456CC': { 
    vehicleInfo: {
      licensePlate: 'BB-456-CC',
      brand: 'Peugeot',
      model: '308',
      vin: 'VF3LBZMRPJS112233',
      firstRegistration: '2019-02-10',
    },
    insuranceInfo: {
      company: 'MAIF',
      policyNumber: 'M98765432',
      contractName: 'Auto Tous Risques',
      validFrom: '2023-03-15',
      validUntil: '2024-03-15',
      guarantees: ['Responsabilité civile', 'Dommages tous accidents', 'Vol', 'Incendie', 'Bris de glace', 'Assistance'],
      insuredName: 'Sophie Lefevre',
      insuredAddress: '45 Rue de la Paix, 75002 Paris',
      insuredPhone: '+33723456789',
      insuredEmail: 'sophie.lefevre@example.com'
    }
  },
  'CC789DD': { 
    vehicleInfo: {
      licensePlate: 'CC-789-DD',
      brand: 'Citroen',
      model: 'C3',
      vin: 'VF7FCKFVC9A123456',
      firstRegistration: '2020-07-22',
    },
    insuranceInfo: {
      company: 'Groupama',
      policyNumber: 'G45678901',
      contractName: 'Auto Référence',
      validFrom: '2023-06-01',
      validUntil: '2024-06-01',
      guarantees: ['Responsabilité civile', 'Dommages collision', 'Vol', 'Incendie'],
      insuredName: 'Philippe Martin',
      insuredAddress: '78 Boulevard Saint-Germain, 75006 Paris',
      insuredPhone: '+33634567890',
      insuredEmail: 'philippe.martin@example.com'
    }
  },
  'DD321EE': { 
    vehicleInfo: {
      licensePlate: 'DD-321-EE',
      brand: 'Volkswagen',
      model: 'Golf',
      vin: 'WVWZZZ1KZAW987654',
      firstRegistration: '2017-11-05',
    },
    insuranceInfo: {
      company: 'Allianz',
      policyNumber: 'A87654321',
      contractName: 'Auto Sur Mesure',
      validFrom: '2023-09-01',
      validUntil: '2024-09-01',
      guarantees: ['Responsabilité civile', 'Dommages tous accidents', 'Vol', 'Incendie', 'Bris de glace', 'Protection juridique'],
      insuredName: 'Julien Dubois',
      insuredAddress: '12 Rue de Rivoli, 75001 Paris',
      insuredPhone: '+33745678901',
      insuredEmail: 'julien.dubois@example.com'
    }
  },
  'EE654FF': { 
    vehicleInfo: {
      licensePlate: 'EE-654-FF',
      brand: 'Toyota',
      model: 'Yaris',
      vin: 'JTDKW113500789012',
      firstRegistration: '2021-03-18',
    },
    insuranceInfo: {
      company: 'MMA',
      policyNumber: 'M12345678',
      contractName: 'Auto Tous Risques Plus',
      validFrom: '2023-02-15',
      validUntil: '2024-02-15',
      guarantees: ['Responsabilité civile', 'Dommages tous accidents', 'Vol', 'Incendie', 'Bris de glace', 'Assistance', 'Protection juridique'],
      insuredName: 'Camille Laurent',
      insuredAddress: '56 Avenue Montaigne, 75008 Paris',
      insuredPhone: '+33656789012',
      insuredEmail: 'camille.laurent@example.com'
    }
  },
  // Plates with hyphens for easier search
  'GQ-691-CF': { 
    vehicleInfo: {
      licensePlate: 'GQ-691-CF',
      brand: 'Renault',
      model: 'Megane',
      vin: 'VF1RFA00066123456',
      firstRegistration: '2019-08-12',
    },
    insuranceInfo: {
      company: 'MMA',
      policyNumber: 'M12345678',
      contractName: 'Auto Tous Risques Plus',
      validFrom: '2023-05-01',
      validUntil: '2024-05-01',
      guarantees: ['Responsabilité civile', 'Dommages tous accidents', 'Vol', 'Incendie', 'Bris de glace', 'Assistance'],
      insuredName: 'Thomas Rousseau',
      insuredAddress: '89 Rue de la Pompe, 75116 Paris',
      insuredPhone: '+33667890123',
      insuredEmail: 'thomas.rousseau@example.com'
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
    
    // Normalize the license plate
    const normalizedPlate = normalizeLicensePlate(licensePlate, 'siv');
    const formattedPlate = licensePlate.toUpperCase();
    
    console.log(`Recherche dans le FVA avec plaque: ${normalizedPlate} ou ${formattedPlate}`);
    
    // Check in the FVA database
    let fvaData = fvaDatabase[normalizedPlate] || fvaDatabase[formattedPlate];
    
    // If not found with normalization, try with original format
    if (!fvaData) {
      // Format to AA-123-BB if it's a 7-character plate
      if (normalizedPlate.length === 7) {
        const formattedPlate = `${normalizedPlate.substring(0, 2)}-${normalizedPlate.substring(2, 5)}-${normalizedPlate.substring(5, 7)}`;
        fvaData = fvaDatabase[formattedPlate];
      }
    }
    
    if (!fvaData) {
      console.log(`Véhicule non trouvé dans le FVA: ${licensePlate}`);
      return createResponse({ 
        success: false,
        error: 'Vehicle not found in FVA',
        message: 'Aucune information trouvée pour ce véhicule dans le Fichier des Véhicules Assurés'
      }, 404);
    }
    
    // Simulate API delay
    await simulateApiDelay(300, 800);
    
    console.log(`Véhicule trouvé dans le FVA: ${JSON.stringify(fvaData)}`);
    
    return createResponse({ 
      success: true,
      data: fvaData,
      message: 'Informations du FVA récupérées avec succès'
    });
  } catch (error) {
    return handleError(error, 'Erreur lors de la consultation du Fichier des Véhicules Assurés');
  }
});
