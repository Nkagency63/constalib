
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Mock geocoding for demo purposes (replace with real API)
const geocodeAddress = (address: string) => {
  // Simulate Paris coordinates with small random offsets for different addresses
  const baseLat = 48.864716;
  const baseLng = 2.349014;
  
  // Generate a deterministic but varying offset based on the address string
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Small offset (±0.01) to simulate different locations
  const latOffset = (hash % 100) / 10000;
  const lngOffset = ((hash >> 4) % 100) / 10000;
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
    formatted_address: address
  };
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()
    
    if (!address) {
      return new Response(
        JSON.stringify({ 
          error: 'Address is required',
          message: 'L\'adresse est requise'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // In a real implementation, you would call an external geocoding API here
    // For demo purposes, we'll use our mock function
    const locationData = geocodeAddress(address);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: locationData
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
