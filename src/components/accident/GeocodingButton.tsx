
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { GeolocationData } from './types';

interface GeocodingButtonProps {
  location: string;
  setGeolocation: (data: GeolocationData) => void;
}

const GeocodingButton = ({ location, setGeolocation }: GeocodingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGeocode = async () => {
    if (!location || location.trim() === '') {
      toast.error("Veuillez saisir une adresse à géolocaliser");
      return;
    }

    setIsLoading(true);

    try {
      // Free geocoding using Nominatim OpenStreetMap API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
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
    <Button
      type="button" 
      size="sm"
      variant="ghost"
      onClick={handleGeocode}
      disabled={isLoading || !location || location.trim() === ''}
      title="Géolocaliser cette adresse"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </Button>
  );
};

export default GeocodingButton;
