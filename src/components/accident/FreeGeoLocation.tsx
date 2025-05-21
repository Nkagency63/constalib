
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { GeolocationData } from './types';

interface FreeGeoLocationProps {
  setGeolocation: (data: GeolocationData) => void;
  address?: string;
}

const FreeGeoLocation: React.FC<FreeGeoLocationProps> = ({ 
  setGeolocation,
  address
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Handle getting user's current location using browser's geolocation API
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLoading(true);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const timestamp = position.timestamp;
        
        try {
          // Free geocoding using Nominatim OpenStreetMap API (no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'fr' } }
          );
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          const data = await response.json();
          const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          
          setGeolocation({
            lat,
            lng,
            address,
            accuracy,
            timestamp
          });
          
          toast.success("Position localisée", {
            description: "Votre position actuelle a été détectée"
          });
        } catch (err) {
          console.error('Error in reverse geocoding:', err);
          
          // Fallback to just coordinates if error occurs
          setGeolocation({
            lat,
            lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            accuracy,
            timestamp
          });
          
          toast.error("Une erreur est survenue mais les coordonnées ont été enregistrées");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Vous avez refusé l'accès à votre position");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Les informations de position ne sont pas disponibles");
            break;
          case error.TIMEOUT:
            toast.error("La demande de position a expiré");
            break;
          default:
            toast.error("Une erreur inconnue s'est produite");
        }
      },
      geoOptions
    );
  };

  // Handle geocoding using Nominatim OpenStreetMap API
  const handleGeocode = async () => {
    if (!address || address.trim() === '') {
      toast.error("Veuillez saisir une adresse à géolocaliser");
      return;
    }

    setIsLoading(true);

    try {
      // Free geocoding using Nominatim OpenStreetMap API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        setGeolocation({
          lat,
          lng,
          address: result.display_name,
          timestamp: Date.now()
        });
        
        toast.success("Adresse géolocalisée avec succès!");
      } else {
        toast.error("Aucun résultat trouvé pour cette adresse");
      }
    } catch (err) {
      console.error('Error in geocoding:', err);
      toast.error("Une erreur est survenue lors de la géolocalisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleGetCurrentLocation}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Détection en cours...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 mr-2" />
            Utiliser ma position actuelle
          </>
        )}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleGeocode}
        disabled={isLoading || !address || address.trim() === ''}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Géolocalisation en cours...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Géolocaliser cette adresse
          </>
        )}
      </Button>
    </div>
  );
};

export default FreeGeoLocation;
