
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Import les en-têtes CORS depuis le fichier partagé
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Base de données simulée des véhicules français (à remplacer par une vraie API SIV)
const frenchVehicleDatabase = {
  'AA123BB': { 
    brand: 'Renault', 
    model: 'Clio', 
    year: '2018', 
    owner: 'REDACTED', 
    firstRegistration: '2018-05-15', 
    status: 'active',
    insurance: {
      company: 'AXA Assurances',
      policy: 'A12345678',
      name: 'Auto Confort'
    }
  },
  'BB456CC': { 
    brand: 'Peugeot', 
    model: '308', 
    year: '2019', 
    owner: 'REDACTED', 
    firstRegistration: '2019-02-10', 
    status: 'active',
    insurance: {
      company: 'MAIF',
      policy: 'M98765432',
      name: 'Auto Tous Risques'
    }
  },
  'CC789DD': { 
    brand: 'Citroen', 
    model: 'C3', 
    year: '2020', 
    owner: 'REDACTED', 
    firstRegistration: '2020-07-22', 
    status: 'active',
    insurance: {
      company: 'Groupama',
      policy: 'G45678901',
      name: 'Auto Référence'
    }
  },
  'DD321EE': { 
    brand: 'Volkswagen', 
    model: 'Golf', 
    year: '2017', 
    owner: 'REDACTED', 
    firstRegistration: '2017-11-05', 
    status: 'active',
    insurance: {
      company: 'Allianz',
      policy: 'A87654321',
      name: 'Auto Sur Mesure'
    }
  },
  'EE654FF': { 
    brand: 'Toyota', 
    model: 'Yaris', 
    year: '2021', 
    owner: 'REDACTED', 
    firstRegistration: '2021-03-18', 
    status: 'active',
    insurance: {
      company: 'MMA',
      policy: 'M12345678',
      name: 'Auto Tous Risques Plus'
    }
  },
  'FF987GG': { 
    brand: 'Ford', 
    model: 'Focus', 
    year: '2019', 
    owner: 'REDACTED', 
    firstRegistration: '2019-09-30', 
    status: 'active',
    insurance: {
      company: 'GMF',
      policy: 'G12345678',
      name: 'Auto Pass'
    }
  },
  'GG123HH': { 
    brand: 'Audi', 
    model: 'A3', 
    year: '2020', 
    owner: 'REDACTED', 
    firstRegistration: '2020-01-12', 
    status: 'active',
    insurance: {
      company: 'Direct Assurance',
      policy: 'D12345678',
      name: 'Auto Eco'
    }
  },
  'HH456II': { 
    brand: 'BMW', 
    model: 'Serie 1', 
    year: '2018', 
    owner: 'REDACTED', 
    firstRegistration: '2018-08-25', 
    status: 'active',
    insurance: {
      company: 'AXA Assurances',
      policy: 'A87654321',
      name: 'Auto Confort Plus'
    }
  },
  'II789JJ': { 
    brand: 'Mercedes', 
    model: 'Classe A', 
    year: '2021', 
    owner: 'REDACTED', 
    firstRegistration: '2021-06-07', 
    status: 'active',
    insurance: {
      company: 'MAIF',
      policy: 'M12345678',
      name: 'Auto Tous Risques'
    }
  },
  'JJ321KK': { 
    brand: 'Fiat', 
    model: '500', 
    year: '2019', 
    owner: 'REDACTED', 
    firstRegistration: '2019-04-14', 
    status: 'active',
    insurance: {
      company: 'Groupama',
      policy: 'G45678901',
      name: 'Auto Référence'
    }
  },
  // Ajout de plus de plaques d'immatriculation au format français (nouveau format AA-123-BB)
  'AB123CD': { 
    brand: 'Dacia', 
    model: 'Sandero', 
    year: '2021', 
    owner: 'REDACTED', 
    firstRegistration: '2021-01-05', 
    status: 'active',
    insurance: {
      company: 'Allianz',
      policy: 'A87654321',
      name: 'Auto Sur Mesure'
    }
  },
  'BC234DE': { 
    brand: 'Renault', 
    model: 'Captur', 
    year: '2020', 
    owner: 'REDACTED', 
    firstRegistration: '2020-09-12', 
    status: 'active',
    insurance: {
      company: 'MMA',
      policy: 'M12345678',
      name: 'Auto Tous Risques Plus'
    }
  },
  'CD345EF': { 
    brand: 'Peugeot', 
    model: '2008', 
    year: '2022', 
    owner: 'REDACTED', 
    firstRegistration: '2022-03-28', 
    status: 'active',
    insurance: {
      company: 'GMF',
      policy: 'G12345678',
      name: 'Auto Pass'
    }
  },
  'DE456FG': { 
    brand: 'Citroen', 
    model: 'C4', 
    year: '2021', 
    owner: 'REDACTED', 
    firstRegistration: '2021-11-19', 
    status: 'active',
    insurance: {
      company: 'Direct Assurance',
      policy: 'D12345678',
      name: 'Auto Eco'
    }
  },
  'EF567GH': { 
    brand: 'DS', 
    model: 'DS3 Crossback', 
    year: '2020', 
    owner: 'REDACTED', 
    firstRegistration: '2020-07-03', 
    status: 'active',
    insurance: {
      company: 'AXA Assurances',
      policy: 'A12345678',
      name: 'Auto Confort'
    }
  },
  // Ancien format de plaques d'immatriculation (3 chiffres + 3 lettres)
  '123ABC': { 
    brand: 'Renault', 
    model: 'Twingo', 
    year: '2012', 
    owner: 'REDACTED', 
    firstRegistration: '2012-06-18', 
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
    year: '2010', 
    owner: 'REDACTED', 
    firstRegistration: '2010-04-22', 
    status: 'active',
    insurance: {
      company: 'Groupama',
      policy: 'G45678901',
      name: 'Auto Référence'
    }
  },
  '789GHI': { 
    brand: 'Citroen', 
    model: 'C2', 
    year: '2008', 
    owner: 'REDACTED', 
    firstRegistration: '2008-09-15', 
    status: 'active',
    insurance: {
      company: 'Allianz',
      policy: 'A87654321',
      name: 'Auto Sur Mesure'
    }
  },
  // Ajout des plaques au format avec tirets pour faciliter la recherche
  'GQ691CF': { 
    brand: 'Renault', 
    model: 'Megane', 
    year: '2019', 
    owner: 'REDACTED', 
    firstRegistration: '2019-08-12', 
    status: 'active',
    insurance: {
      company: 'MMA',
      policy: 'M12345678',
      name: 'Auto Tous Risques Plus'
    }
  },
  'GQ-691-CF': { 
    brand: 'Renault', 
    model: 'Megane', 
    year: '2019', 
    owner: 'REDACTED', 
    firstRegistration: '2019-08-12', 
    status: 'active',
    insurance: {
      company: 'MMA',
      policy: 'M12345678',
      name: 'Auto Tous Risques Plus'
    }
  },
};

serve(async (req) => {
  // Gestion des CORS pour les requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { licensePlate } = await req.json()
    
    // Normalisation de la plaque d'immatriculation (suppression des espaces et tirets, conversion en majuscules)
    const normalizedPlate = licensePlate.replace(/[\s-]+/g, '').toUpperCase();
    
    console.log(`Recherche de véhicule français avec plaque: ${normalizedPlate}`);
    
    // Vérification dans la base de données des véhicules français
    let vehicleData = frenchVehicleDatabase[normalizedPlate];
    
    // Vérification avec la version avec tirets si non trouvé
    if (!vehicleData && normalizedPlate.length === 7) {
      // Format possible AA-123-BB
      const formattedPlate = `${normalizedPlate.substring(0, 2)}-${normalizedPlate.substring(2, 5)}-${normalizedPlate.substring(5, 7)}`;
      vehicleData = frenchVehicleDatabase[formattedPlate];
    }
    
    // Fallback à la base de données originale si non trouvé
    if (!vehicleData) {
      const fallbackDatabase = {
        'AA123BB': { 
          brand: 'Renault', 
          model: 'Clio', 
          year: '2018',
          insurance: {
            company: 'AXA Assurances',
            policy: 'A12345678',
            name: 'Auto Confort'
          }
        },
        'BB456CC': { 
          brand: 'Peugeot', 
          model: '308', 
          year: '2019',
          insurance: {
            company: 'MAIF',
            policy: 'M98765432',
            name: 'Auto Tous Risques'
          }
        },
        'CC789DD': { 
          brand: 'Citroen', 
          model: 'C3', 
          year: '2020',
          insurance: {
            company: 'Groupama',
            policy: 'G45678901',
            name: 'Auto Référence'
          }
        },
      };
      
      vehicleData = fallbackDatabase[normalizedPlate];
    }
    
    if (!vehicleData) {
      console.log(`Véhicule non trouvé dans la base de données SIV: ${normalizedPlate}`);
      return new Response(
        JSON.stringify({ 
          error: 'Vehicle not found',
          message: 'Aucun véhicule trouvé avec cette immatriculation dans le SIV'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }
    
    // Simulation d'un léger délai comme une vraie API aurait (300-800ms)
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 300));
    
    console.log(`Véhicule trouvé dans SIV: ${JSON.stringify(vehicleData)}`);
    
    // Retourne uniquement les données publiques (pas les informations du propriétaire)
    const publicData = {
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
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: publicData,
        message: 'Véhicule identifié avec succès dans le SIV'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error(`Erreur dans SIV lookup-vehicle: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Erreur lors de la consultation du SIV'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
