
import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";

interface CurrentLocationButtonProps {
  setGeolocation: (data: {lat: number, lng: number, address: string}) => void;
}

const CurrentLocationButton = ({
  setGeolocation
}: CurrentLocationButtonProps) => {
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: `${latitude},${longitude}` }
      });
      
      if (error || !data.success) {
        console.error('Error in reverse geocoding:', error || data.error);
        return `Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
      
      return data.data.formatted_address;
    } catch (err) {
      console.error('Error in reverse geocoding:', err);
      return `Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Non supporté",
        description: "La géolocalisation n'est pas supportée par votre navigateur",
        variant: "destructive",
      });
      return;
    }

    setIsGettingCurrentLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        
        // Perform reverse geocoding to get address from coordinates
        const address = await reverseGeocode(latitude, longitude);
        
        setGeolocation({
          lat: latitude,
          lng: longitude,
          address: address
        });
        
        toast({
          title: "Succès",
          description: "Position actuelle récupérée",
        });
        setIsGettingCurrentLocation(false);
      },
      error => {
        console.error('Error getting current location:', error);
        
        let message = "Impossible de récupérer votre position";
        if (error.code === 1) {
          message = "Vous avez refusé l'accès à votre position";
        } else if (error.code === 2) {
          message = "Votre position n'est pas disponible";
        } else if (error.code === 3) {
          message = "La demande a expiré";
        }
        
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
        setIsGettingCurrentLocation(false);
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
      onClick={getCurrentLocation}
      disabled={isGettingCurrentLocation}
      className="w-full flex items-center justify-center"
    >
      {isGettingCurrentLocation ? 
        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
        <MapPin className="h-4 w-4 mr-2" />
      }
      Utiliser ma position actuelle
    </Button>
  );
};

export default CurrentLocationButton;
