
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Mock central vehicle registration database for demo purposes (replace with real API)
const centralVehicleDatabase = {
  'AA123BB': { brand: 'Renault', model: 'Clio', year: '2018', owner: 'REDACTED', firstRegistration: '2018-05-15', status: 'active' },
  'BB456CC': { brand: 'Peugeot', model: '308', year: '2019', owner: 'REDACTED', firstRegistration: '2019-02-10', status: 'active' },
  'CC789DD': { brand: 'Citroen', model: 'C3', year: '2020', owner: 'REDACTED', firstRegistration: '2020-07-22', status: 'active' },
  'DD321EE': { brand: 'Volkswagen', model: 'Golf', year: '2017', owner: 'REDACTED', firstRegistration: '2017-11-05', status: 'active' },
  'EE654FF': { brand: 'Toyota', model: 'Yaris', year: '2021', owner: 'REDACTED', firstRegistration: '2021-03-18', status: 'active' },
  'FF987GG': { brand: 'Ford', model: 'Focus', year: '2019', owner: 'REDACTED', firstRegistration: '2019-09-30', status: 'active' },
  'GG123HH': { brand: 'Audi', model: 'A3', year: '2020', owner: 'REDACTED', firstRegistration: '2020-01-12', status: 'active' },
  'HH456II': { brand: 'BMW', model: 'Serie 1', year: '2018', owner: 'REDACTED', firstRegistration: '2018-08-25', status: 'active' },
  'II789JJ': { brand: 'Mercedes', model: 'Classe A', year: '2021', owner: 'REDACTED', firstRegistration: '2021-06-07', status: 'active' },
  'JJ321KK': { brand: 'Fiat', model: '500', year: '2019', owner: 'REDACTED', firstRegistration: '2019-04-14', status: 'active' },
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { licensePlate } = await req.json()
    
    // Normalize license plate (remove spaces, convert to uppercase)
    const normalizedPlate = licensePlate.replace(/\s+/g, '').toUpperCase();
    
    console.log(`Looking up vehicle with plate: ${normalizedPlate}`);
    
    // First check our expanded central database (more vehicles)
    let vehicleData = centralVehicleDatabase[normalizedPlate];
    
    // Fall back to the original database if not found
    if (!vehicleData) {
      const fallbackDatabase = {
        'AA123BB': { brand: 'Renault', model: 'Clio', year: '2018' },
        'BB456CC': { brand: 'Peugeot', model: '308', year: '2019' },
        'CC789DD': { brand: 'Citroen', model: 'C3', year: '2020' },
      };
      
      vehicleData = fallbackDatabase[normalizedPlate];
    }
    
    if (!vehicleData) {
      console.log(`Vehicle not found: ${normalizedPlate}`);
      return new Response(
        JSON.stringify({ 
          error: 'Vehicle not found',
          message: 'Aucun véhicule trouvé avec cette immatriculation'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }
    
    // Simulate a slight delay as a real API would have (300-800ms)
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 300));
    
    console.log(`Vehicle found: ${JSON.stringify(vehicleData)}`);
    
    // Only return the public data (not the owner information)
    const publicData = {
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      firstRegistration: vehicleData.firstRegistration
    };
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: publicData,
        message: 'Véhicule identifié avec succès'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error(`Error in lookup-vehicle: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
