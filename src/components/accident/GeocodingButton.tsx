
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";

interface GeocodingButtonProps {
  location: string;
  setGeolocation: (data: {lat: number, lng: number, address: string}) => void;
}

const GeocodingButton = ({
  location,
  setGeolocation
}: GeocodingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const geocodeAddress = async () => {
    if (!location) {
      toast({
        title: "Adresse requise",
        description: "Veuillez saisir une adresse",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: location }
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la géolocalisation",
          variant: "destructive",
        });
        console.error('Error geocoding address:', error);
        return;
      }

      if (data.success && data.data) {
        setGeolocation({
          lat: data.data.lat,
          lng: data.data.lng,
          address: data.data.formatted_address
        });
        toast({
          title: "Succès",
          description: "Adresse géolocalisée avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de géolocaliser cette adresse",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error in geocoding:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
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
      data-geocode-button
    >
      {isLoading ? 
        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
        <Search className="h-4 w-4 mr-1" />
      }
      Géolocaliser
    </Button>
  );
};

export default GeocodingButton;
