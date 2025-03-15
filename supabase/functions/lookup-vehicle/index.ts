
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Mock vehicle database for demo purposes (replace with real API)
const vehicleDatabase = {
  'AA123BB': { brand: 'Renault', model: 'Clio', year: '2018' },
  'BB456CC': { brand: 'Peugeot', model: '308', year: '2019' },
  'CC789DD': { brand: 'Citroen', model: 'C3', year: '2020' },
  // Add more mock entries as needed
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
    
    // In a real implementation, you would call an external API here
    // For demo purposes, we'll use our mock database
    const vehicleData = vehicleDatabase[normalizedPlate];
    
    if (!vehicleData) {
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
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: vehicleData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
