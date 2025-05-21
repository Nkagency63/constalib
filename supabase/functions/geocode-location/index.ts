
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Real geocoding using OpenStreetMap Nominatim API (free, no API key required)
const geocodeAddress = async (address: string) => {
  try {
    // Check if address is a coordinate pair (for reverse geocoding)
    const isCoordinates = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(address);
    
    if (isCoordinates) {
      // Reverse geocoding (coordinates to address)
      const [lat, lng] = address.split(',').map(coord => parseFloat(coord.trim()));
      const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      
      const response = await fetch(reverseGeocodingUrl, {
        headers: {
          'User-Agent': 'Constalib/1.0'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Nominatim Reverse API error:', data);
        throw new Error('Reverse geocoding service error');
      }
      
      if (data && data.display_name) {
        return {
          lat,
          lng, 
          formatted_address: data.display_name
        };
      }
      
      return {
        lat,
        lng,
        formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
    } else {
      // Forward geocoding (address to coordinates)
      // Encode the address for URL
      const encodedAddress = encodeURIComponent(address);
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
      
      const response = await fetch(geocodingUrl, {
        headers: {
          'User-Agent': 'Constalib/1.0'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Nominatim API error:', data);
        throw new Error('Geocoding service error');
      }
      
      if (data && data.length > 0) {
        const result = data[0];
        
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          formatted_address: result.display_name
        };
      }
      
      throw new Error('No results found for this address');
    }
  } catch (error) {
    console.error('Error in geocoding with Nominatim:', error);
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
