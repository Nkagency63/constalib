
/**
 * Utilitaire pour les requêtes de géocodage avec gestion CORS
 */

// Utiliser un proxy CORS plus fiable pour éviter les erreurs de requêtes cross-origin
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Effectue une requête de géocodage inverse (coordonnées vers adresse)
 * @param lat Latitude
 * @param lng Longitude
 * @returns Adresse correspondante aux coordonnées
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Utiliser le proxy CORS pour contourner les restrictions CORS
    const url = `${CORS_PROXY}${encodeURIComponent(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)}`;
    
    console.log("Requête de géocodage inverse avec URL:", url);
    
    const response = await fetch(url, {
      headers: { 
        'Accept-Language': 'fr',
        'User-Agent': 'ConstaLib/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur de géocodage: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Réponse du géocodage inverse:", data);
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error);
    // Retourner les coordonnées formatées en cas d'erreur
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

/**
 * Effectue une requête de géocodage (adresse vers coordonnées)
 * @param address Adresse à géocoder
 * @returns Coordonnées correspondantes à l'adresse
 */
export const forwardGeocode = async (address: string): Promise<{lat: number, lng: number, display_name: string} | null> => {
  try {
    // Utiliser le proxy CORS pour contourner les restrictions CORS
    const url = `${CORS_PROXY}${encodeURIComponent(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`)}`;
    
    console.log("Requête de géocodage avec URL:", url);
    
    const response = await fetch(url, {
      headers: { 
        'Accept-Language': 'fr',
        'User-Agent': 'ConstaLib/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur de géocodage: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Réponse du géocodage:", data);
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    return null;
  }
};

/**
 * Utilise l'API Supabase Geocoding Edge Function si disponible, sinon utilise Nominatim directement
 * @param lat Latitude
 * @param lng Longitude
 * @returns Adresse complète
 */
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    // Tentative d'utilisation de l'EdgeFunction de Supabase
    const edgeFunctionUrl = import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL;
    
    if (edgeFunctionUrl) {
      const url = `${edgeFunctionUrl}/geocode-location`;
      console.log("Tentative d'utilisation de l'EdgeFunction pour le géocodage:", url);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: `${lat},${lng}`,
            options: {
              includeDetails: true,
              language: 'fr'
            }
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Résultat de l'EdgeFunction:", result);
          if (result.success && result.data && result.data.formatted_address) {
            return result.data.formatted_address;
          }
        } else {
          console.warn("L'EdgeFunction a échoué, utilisation du fallback");
        }
      } catch (edgeError) {
        console.error("Erreur avec l'EdgeFunction:", edgeError);
      }
    }
    
    console.log("Utilisation du fallback Nominatim pour le géocodage inverse");
    // Fallback sur Nominatim si l'EdgeFunction échoue
    return reverseGeocode(lat, lng);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'adresse:', error);
    return reverseGeocode(lat, lng);
  }
};
