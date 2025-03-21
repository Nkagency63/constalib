
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Real geocoding using Mapbox API
const geocodeAddress = async (address: string) => {
  // Use Mapbox API for geocoding
  const mapboxToken = Deno.env.get('MAPBOX_API_KEY');
  
  if (!mapboxToken) {
    console.error('Missing MAPBOX_API_KEY environment variable');
    throw new Error('Geocoding service configuration error');
  }
  
  try {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address);
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}`;
    
    const response = await fetch(geocodingUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Mapbox API error:', data);
      throw new Error('Geocoding service error');
    }
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      // Mapbox returns coordinates as [longitude, latitude]
      const [lng, lat] = feature.center;
      
      return {
        lat,
        lng,
        formatted_address: feature.place_name
      };
    }
    
    throw new Error('No results found for this address');
  } catch (error) {
    console.error('Error in geocoding with Mapbox:', error);
    throw error;
  }
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
    
    // Use real geocoding service
    try {
      const locationData = await geocodeAddress(address);
      
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
      console.error('Geocoding error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Geocoding failed',
          message: 'La géolocalisation a échoué'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
  } catch (error) {
    console.error('Request error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Une erreur est survenue'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
