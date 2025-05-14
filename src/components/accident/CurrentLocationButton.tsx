
import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CurrentLocationButtonProps {
  setGeolocation: (data: {lat: number, lng: number, address: string}) => void;
}

const CurrentLocationButton = ({ setGeolocation }: CurrentLocationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast("Erreur", {
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
          // Reverse geocoding to get the address
          const { data, error } = await supabase.functions.invoke('geocode-location', {
            body: { address: `${lat},${lng}` }
          });

          if (error) {
            toast("Erreur", {
              description: "Impossible d'obtenir l'adresse pour votre position"
            });
            console.error('Error reverse geocoding:', error);
          } else if (data?.success && data?.data) {
            setGeolocation({
              lat,
              lng,
              address: data.data.formatted_address
            });
            toast("Position localisée", {
              description: "Votre position actuelle a été détectée"
            });
          }
        } catch (err) {
          console.error('Error in reverse geocoding:', err);
          toast("Erreur", {
            description: "Une erreur est survenue lors de la géolocalisation"
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast("Accès refusé", {
              description: "Vous avez refusé l'accès à votre position"
            });
            break;
          case error.POSITION_UNAVAILABLE:
            toast("Position indisponible", {
              description: "Les informations de position ne sont pas disponibles"
            });
            break;
          case error.TIMEOUT:
            toast("Délai expiré", {
              description: "La demande de position a expiré"
            });
            break;
          default:
            toast("Erreur", {
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
