
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Mock French central vehicle registration database (replace with real SIV API)
const frenchVehicleDatabase = {
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
  // Added more French format license plates (new format AA-123-BB)
  'AB123CD': { brand: 'Dacia', model: 'Sandero', year: '2021', owner: 'REDACTED', firstRegistration: '2021-01-05', status: 'active' },
  'BC234DE': { brand: 'Renault', model: 'Captur', year: '2020', owner: 'REDACTED', firstRegistration: '2020-09-12', status: 'active' },
  'CD345EF': { brand: 'Peugeot', model: '2008', year: '2022', owner: 'REDACTED', firstRegistration: '2022-03-28', status: 'active' },
  'DE456FG': { brand: 'Citroen', model: 'C4', year: '2021', owner: 'REDACTED', firstRegistration: '2021-11-19', status: 'active' },
  'EF567GH': { brand: 'DS', model: 'DS3 Crossback', year: '2020', owner: 'REDACTED', firstRegistration: '2020-07-03', status: 'active' },
  // Old format license plates (3 numbers + 3 letters)
  '123ABC': { brand: 'Renault', model: 'Twingo', year: '2012', owner: 'REDACTED', firstRegistration: '2012-06-18', status: 'active' },
  '456DEF': { brand: 'Peugeot', model: '206', year: '2010', owner: 'REDACTED', firstRegistration: '2010-04-22', status: 'active' },
  '789GHI': { brand: 'Citroen', model: 'C2', year: '2008', owner: 'REDACTED', firstRegistration: '2008-09-15', status: 'active' },
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { licensePlate } = await req.json()
    
    // Normalize license plate (remove spaces and dashes, convert to uppercase)
    const normalizedPlate = licensePlate.replace(/[\s-]+/g, '').toUpperCase();
    
    console.log(`Looking up French vehicle with plate: ${normalizedPlate}`);
    
    // Check the French vehicle database
    let vehicleData = frenchVehicleDatabase[normalizedPlate];
    
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
      console.log(`Vehicle not found in SIV database: ${normalizedPlate}`);
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
    
    // Simulate a slight delay as a real API would have (300-800ms)
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 300));
    
    console.log(`Vehicle found in SIV: ${JSON.stringify(vehicleData)}`);
    
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
        message: 'Véhicule identifié avec succès dans le SIV'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error(`Error in SIV lookup-vehicle: ${error.message}`);
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
