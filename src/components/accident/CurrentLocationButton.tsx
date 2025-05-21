
import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { GeolocationData } from './types';
import { getAddressFromCoordinates } from '@/utils/geocoding';

interface CurrentLocationButtonProps {
  setGeolocation: (data: GeolocationData) => void;
}

const CurrentLocationButton = ({ setGeolocation }: CurrentLocationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLoading(true);
    toast.info("Détection de votre position en cours...");

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
        
        console.log("Position géolocalisée:", { lat, lng, accuracy });
        
        try {
          toast.info("Récupération de l'adresse en cours...");
          // Utiliser notre utilitaire amélioré pour le géocodage inverse
          const address = await getAddressFromCoordinates(lat, lng);
          console.log("Adresse récupérée:", address);
          
          setGeolocation({
            lat,
            lng,
            address,
            accuracy,
            timestamp
          });
          
          toast.success("Position localisée", {
            description: address || "Votre position actuelle a été détectée"
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

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGetCurrentLocation}
      disabled={isLoading}
      className="w-full"
      data-location-button
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
  );
};

export default CurrentLocationButton;
