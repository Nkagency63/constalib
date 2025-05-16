
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface GeocodingOptions {
  includeDetails?: boolean;
  language?: string;
  limit?: number;
}

// Geocoding using OpenStreetMap Nominatim API 
const geocodeAddress = async (address: string, options: GeocodingOptions = {}) => {
  try {
    const { 
      includeDetails = false,
      language = 'fr',
      limit = 1
    } = options;
    
    // Check if address is a coordinate pair (for reverse geocoding)
    const isCoordinates = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(address);
    
    if (isCoordinates) {
      // Reverse geocoding (coordinates to address)
      const [lat, lng] = address.split(',').map(coord => parseFloat(coord.trim()));
      const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=${language}`;
      
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
        const result = {
          lat,
          lng,
          formatted_address: data.display_name
        };

        // Include additional details if requested
        if (includeDetails) {
          return {
            ...result,
            accuracy: 20, // Default accuracy for reverse geocoding in meters
            raw_data: includeDetails ? data : undefined,
            address_components: data.address
          };
        }
        
        return result;
      }
      
      return {
        lat,
        lng,
        formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
    } else {
      // Forward geocoding (address to coordinates)
      const encodedAddress = encodeURIComponent(address);
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=${limit}&accept-language=${language}`;
      
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
        
        const geocodingResult = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          formatted_address: result.display_name
        };

        // Include additional details if requested
        if (includeDetails) {
          return {
            ...geocodingResult,
            accuracy: parseFloat(result.importance || 0.5) * 1000, // Convert importance to accuracy in meters (estimated)
            place_id: result.place_id,
            osm_id: result.osm_id,
            osm_type: result.osm_type,
            address_components: result.address,
            boundingbox: result.boundingbox,
            raw_data: includeDetails ? result : undefined,
            all_results: includeDetails && limit > 1 ? data.slice(0, limit) : undefined
          };
        }
        
        return geocodingResult;
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
    const { address, options } = await req.json()
    
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
    
    try {
      const locationData = await geocodeAddress(address, options);
      
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
          message: 'La géolocalisation a échoué',
          details: error.message
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
