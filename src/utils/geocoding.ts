
/**
 * Utilitaire pour les requêtes de géocodage avec gestion CORS
 */

// Proxy CORS pour éviter les erreurs de requêtes cross-origin
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Effectue une requête de géocodage inverse (coordonnées vers adresse)
 * @param lat Latitude
 * @param lng Longitude
 * @returns Adresse correspondante aux coordonnées
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Utilisez le proxy CORS pour contourner les restrictions CORS
    const url = `${CORS_PROXY}https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    
    const response = await fetch(url, {
      headers: { 
        'Accept-Language': 'fr',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur de géocodage: ${response.statusText}`);
    }
    
    const data = await response.json();
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
    // Utilisez le proxy CORS pour contourner les restrictions CORS
    const url = `${CORS_PROXY}https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: { 
        'Accept-Language': 'fr',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur de géocodage: ${response.statusText}`);
    }
    
    const data = await response.json();
    
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
