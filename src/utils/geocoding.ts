
/**
 * Utilitaire pour les requêtes de géocodage avec gestion CORS
 */

// Utiliser plusieurs proxies CORS pour avoir une meilleure fiabilité
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url='
];

// Index du proxy actuel
let currentProxyIndex = 0;

// Obtenir le prochain proxy dans la liste
const getNextProxy = () => {
  currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
  return CORS_PROXIES[currentProxyIndex];
};

/**
 * Effectue une requête de géocodage inverse (coordonnées vers adresse)
 * @param lat Latitude
 * @param lng Longitude
 * @returns Adresse correspondante aux coordonnées
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // Essayer avec plusieurs proxies en cas d'échec
  for (let attempt = 0; attempt < CORS_PROXIES.length; attempt++) {
    const proxy = CORS_PROXIES[(currentProxyIndex + attempt) % CORS_PROXIES.length];
    
    try {
      const url = `${proxy}${encodeURIComponent(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)}`;
      
      console.log(`Tentative de géocodage inverse avec proxy ${attempt+1}/${CORS_PROXIES.length}:`, proxy);
      
      const response = await fetch(url, {
        headers: { 
          'Accept-Language': 'fr',
          'User-Agent': 'ConstaLib/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur de géocodage (${response.status}): ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Si la réponse contient une adresse valide
      if (data && (data.display_name || data.address)) {
        // Formater l'adresse de manière plus lisible
        if (data.address) {
          const address = formatAddress(data.address);
          console.log("Adresse formatée:", address);
          return address || data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
        
        return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error(`Échec avec proxy ${attempt+1}/${CORS_PROXIES.length}:`, error);
      // Continuer avec le prochain proxy si échec
      continue;
    }
  }
  
  // Tous les proxies ont échoué, utiliser l'API de secours ou retourner juste les coordonnées
  try {
    // Tentative avec l'API MapQuest (qui ne nécessite pas de proxy CORS)
    const mapQuestKey = import.meta.env.VITE_MAPQUEST_API_KEY;
    if (mapQuestKey) {
      const url = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${mapQuestKey}&location=${lat},${lng}&outFormat=json`;
      
      console.log("Tentative avec l'API MapQuest");
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results[0].locations && data.results[0].locations.length > 0) {
          const location = data.results[0].locations[0];
          const formattedAddress = [
            location.street,
            [location.postalCode, location.adminArea5].filter(Boolean).join(' '),
            location.adminArea1
          ].filter(Boolean).join(', ');
          
          return formattedAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
      }
    }
  } catch (error) {
    console.error("Échec de l'API de secours:", error);
  }
  
  // En dernier recours, retourner les coordonnées formatées
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Formate une adresse à partir des éléments d'adresse de Nominatim
 * @param addressObj Objet contenant les éléments d'adresse
 * @returns Adresse formatée
 */
const formatAddress = (addressObj: any): string => {
  // Éléments d'adresse à inclure dans l'ordre
  const elements = [];
  
  // Ajouter le numéro de rue et la rue si disponibles
  if (addressObj.house_number && addressObj.road) {
    elements.push(`${addressObj.house_number} ${addressObj.road}`);
  } else if (addressObj.road) {
    elements.push(addressObj.road);
  }
  
  // Ajouter le code postal et la ville
  if (addressObj.postcode && addressObj.city) {
    elements.push(`${addressObj.postcode} ${addressObj.city}`);
  } else if (addressObj.postcode && addressObj.town) {
    elements.push(`${addressObj.postcode} ${addressObj.town}`);
  } else if (addressObj.postcode && addressObj.village) {
    elements.push(`${addressObj.postcode} ${addressObj.village}`);
  } else if (addressObj.city) {
    elements.push(addressObj.city);
  } else if (addressObj.town) {
    elements.push(addressObj.town);
  } else if (addressObj.village) {
    elements.push(addressObj.village);
  }
  
  // Ajouter le pays
  if (addressObj.country) {
    elements.push(addressObj.country);
  }
  
  return elements.join(', ');
};

/**
 * Effectue une requête de géocodage (adresse vers coordonnées)
 * @param address Adresse à géocoder
 * @returns Coordonnées correspondantes à l'adresse
 */
export const forwardGeocode = async (address: string): Promise<{lat: number, lng: number, display_name: string} | null> => {
  // Essayer avec plusieurs proxies en cas d'échec
  for (let attempt = 0; attempt < CORS_PROXIES.length; attempt++) {
    const proxy = CORS_PROXIES[(currentProxyIndex + attempt) % CORS_PROXIES.length];
    
    try {
      const url = `${proxy}${encodeURIComponent(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`)}`;
      
      console.log(`Tentative de géocodage avec proxy ${attempt+1}/${CORS_PROXIES.length}:`, proxy);
      
      const response = await fetch(url, {
        headers: { 
          'Accept-Language': 'fr',
          'User-Agent': 'ConstaLib/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur de géocodage (${response.status}): ${response.statusText}`);
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
      
      // Aucun résultat trouvé, essayer le prochain proxy
      continue;
      
    } catch (error) {
      console.error(`Échec avec proxy ${attempt+1}/${CORS_PROXIES.length}:`, error);
      // Continuer avec le prochain proxy
      continue;
    }
  }
  
  // Tous les proxies ont échoué, utiliser l'API de secours
  try {
    // Tentative avec l'API MapQuest
    const mapQuestKey = import.meta.env.VITE_MAPQUEST_API_KEY;
    if (mapQuestKey) {
      const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${mapQuestKey}&location=${encodeURIComponent(address)}`;
      
      console.log("Tentative avec l'API MapQuest");
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results[0].locations && data.results[0].locations.length > 0) {
          const location = data.results[0].locations[0];
          return {
            lat: location.latLng.lat,
            lng: location.latLng.lng,
            display_name: location.street + ', ' + location.adminArea5 + ', ' + location.adminArea1
          };
        }
      }
    }
  } catch (error) {
    console.error("Échec de l'API de secours:", error);
  }
  
  return null;
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
    
    console.log("Utilisation de Nominatim pour le géocodage inverse");
    // Fallback sur Nominatim si l'EdgeFunction échoue
    return reverseGeocode(lat, lng);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'adresse:', error);
    return reverseGeocode(lat, lng);
  }
};
