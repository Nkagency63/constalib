
import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GeolocationData } from '@/hooks/accident/useLocationForm';

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
          // Reverse geocoding to get the address
          const { data, error } = await supabase.functions.invoke('geocode-location', {
            body: { 
              address: `${lat},${lng}`,
              options: {
                includeDetails: true
              }
            }
          });

          if (error) {
            toast.error("Impossible d'obtenir l'adresse pour votre position");
            console.error('Error reverse geocoding:', error);
            
            // Still set the geolocation with coordinates even if address lookup fails
            setGeolocation({
              lat,
              lng,
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              accuracy,
              timestamp
            });
          } else if (data?.success && data?.data) {
            setGeolocation({
              lat,
              lng,
              address: data.data.formatted_address,
              accuracy,
              timestamp
            });
            toast.success("Position localisée", {
              description: "Votre position actuelle a été détectée"
            });
          }
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
