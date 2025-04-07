
import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

interface GeocodingButtonProps {
  location: string;
  onGeocodeSuccess: (data: {lat: number, lng: number, address: string}) => void;
  onGeocodeError: () => void;
  onGeocodeStart: () => void;
}

const GeocodingButton = ({
  location,
  onGeocodeSuccess,
  onGeocodeError,
  onGeocodeStart
}: GeocodingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const geocodeAddress = async () => {
    if (!location) {
      toast.error("Veuillez saisir une adresse");
      return;
    }

    setIsLoading(true);
    onGeocodeStart();
    
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: location }
      });

      if (error) {
        toast.error("Erreur lors de la géolocalisation");
        console.error('Error geocoding address:', error);
        onGeocodeError();
        return;
      }

      if (data.success && data.data) {
        onGeocodeSuccess({
          lat: data.data.lat,
          lng: data.data.lng,
          address: data.data.formatted_address
        });
        toast.success("Adresse géolocalisée avec succès");
      } else {
        toast.error(data.message || "Impossible de géolocaliser cette adresse");
        onGeocodeError();
      }
    } catch (err) {
      console.error('Error in geocoding:', err);
      toast.error("Une erreur est survenue");
      onGeocodeError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      size="sm"
      variant="ghost"
      onClick={geocodeAddress}
      disabled={isLoading || !location}
      className="h-8 px-2 text-xs"
    >
      {isLoading ? 
        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
        <MapPin className="h-4 w-4 mr-1" />
      }
      Géolocaliser
    </Button>
  );
};

export default GeocodingButton;
