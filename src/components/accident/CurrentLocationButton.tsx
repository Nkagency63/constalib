
import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';

interface CurrentLocationButtonProps {
  setGeolocation: (data: {lat: number, lng: number, address: string}) => void;
}

const CurrentLocationButton = ({ setGeolocation }: CurrentLocationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erreur",
        description: "La géolocalisation n'est pas supportée par votre navigateur"
      });
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          // Pour simplifier, nous allons juste utiliser les coordonnées directement
          // au lieu de faire un appel à l'API de geocoding qui pourrait ne pas fonctionner
          setGeolocation({
            lat,
            lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          });
          
          toast({
            title: "Succès",
            description: "Votre position actuelle a été détectée"
          });
          
        } catch (err) {
          console.error('Error in geolocation:', err);
          
          // Fallback to just coordinates if error occurs
          setGeolocation({
            lat,
            lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          });
          
          toast({
            title: "Information",
            description: "Les coordonnées ont été enregistrées mais l'adresse n'a pas pu être récupérée"
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast({
              title: "Erreur",
              description: "Vous avez refusé l'accès à votre position"
            });
            break;
          case error.POSITION_UNAVAILABLE:
            toast({
              title: "Erreur",
              description: "Les informations de position ne sont pas disponibles"
            });
            break;
          case error.TIMEOUT:
            toast({
              title: "Erreur", 
              description: "La demande de position a expiré"
            });
            break;
          default:
            toast({
              title: "Erreur",
              description: "Une erreur inconnue s'est produite"
            });
        }
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
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
