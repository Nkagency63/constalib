
import { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

interface LocationStepProps {
  location: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setGeolocation: (data: {lat: number, lng: number, address: string}) => void;
}

const LocationStep = ({
  location,
  handleInputChange,
  setGeolocation
}: LocationStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  const geocodeAddress = async () => {
    if (!location) {
      toast.error("Veuillez saisir une adresse");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: location }
      });

      if (error) {
        toast.error("Erreur lors de la géolocalisation");
        console.error('Error geocoding address:', error);
        return;
      }

      if (data.success && data.data) {
        setGeolocation({
          lat: data.data.lat,
          lng: data.data.lng,
          address: data.data.formatted_address
        });
        toast.success("Adresse géolocalisée avec succès");
      } else {
        toast.error(data.message || "Impossible de géolocaliser cette adresse");
      }
    } catch (err) {
      console.error('Error in geocoding:', err);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsGettingCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // Reverse geocoding could be done here with a real API
        // For now, we'll just update the location field with coordinates
        const locationString = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
        const event = {
          target: {
            name: 'location',
            value: locationString
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(event);
        setGeolocation({
          lat: latitude,
          lng: longitude,
          address: locationString
        });
        
        toast.success("Position actuelle récupérée");
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
        
        toast.error(message);
        setIsGettingCurrentLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium text-constalib-dark">
          Lieu de l'accident
        </label>
        <div className="relative">
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={handleInputChange}
            placeholder="Adresse ou description du lieu"
            className="w-full px-4 py-2 pl-10 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
            required
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <Button 
              type="button" 
              size="sm"
              variant="ghost"
              onClick={geocodeAddress}
              disabled={isLoading}
              className="h-8 px-2 text-xs"
            >
              {isLoading ? 
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
                <MapPin className="h-4 w-4 mr-1" />
              }
              Géolocaliser
            </Button>
          </div>
        </div>
        <p className="text-sm text-constalib-dark-gray mt-1">
          Saisissez l'adresse précise ou décrivez le lieu de l'accident
        </p>
      </div>
      
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
      
      {currentLocation && (
        <div className="bg-constalib-light-blue/30 p-4 rounded-lg">
          <p className="text-sm text-constalib-dark">
            <span className="font-medium">Position actuelle:</span> Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationStep;
