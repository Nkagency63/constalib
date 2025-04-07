
import { useState, useEffect } from 'react';
import { MapPin, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [formattedAddress, setFormattedAddress] = useState('');
  const [geocodingStatus, setGeocodingStatus] = useState<'none' | 'success' | 'error'>('none');

  const geocodeAddress = async () => {
    if (!location) {
      toast.error("Veuillez saisir une adresse");
      return;
    }

    setIsLoading(true);
    setGeocodingStatus('none');
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: location }
      });

      if (error) {
        toast.error("Erreur lors de la géolocalisation");
        console.error('Error geocoding address:', error);
        setGeocodingStatus('error');
        return;
      }

      if (data.success && data.data) {
        setGeolocation({
          lat: data.data.lat,
          lng: data.data.lng,
          address: data.data.formatted_address
        });
        setCurrentLocation({
          lat: data.data.lat,
          lng: data.data.lng
        });
        setFormattedAddress(data.data.formatted_address);
        setGeocodingStatus('success');
        toast.success("Adresse géolocalisée avec succès");
      } else {
        toast.error(data.message || "Impossible de géolocaliser cette adresse");
        setGeocodingStatus('error');
      }
    } catch (err) {
      console.error('Error in geocoding:', err);
      toast.error("Une erreur est survenue");
      setGeocodingStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setFormattedAddress('Recherche de l\'adresse...');
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: `${latitude},${longitude}` }
      });
      
      if (error || !data.success) {
        console.error('Error in reverse geocoding:', error || data.error);
        setFormattedAddress(`Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        return `Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
      
      setFormattedAddress(data.data.formatted_address);
      return data.data.formatted_address;
    } catch (err) {
      console.error('Error in reverse geocoding:', err);
      setFormattedAddress(`Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      return `Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsGettingCurrentLocation(true);
    setGeocodingStatus('none');
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // Perform reverse geocoding to get address from coordinates
        const address = await reverseGeocode(latitude, longitude);
        
        const event = {
          target: {
            name: 'location',
            value: address
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(event);
        setGeolocation({
          lat: latitude,
          lng: longitude,
          address: address
        });
        
        setGeocodingStatus('success');
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
        setGeocodingStatus('error');
        setIsGettingCurrentLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    // If location changes externally, reset the geocoding status
    setGeocodingStatus('none');
  }, [location]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium text-constalib-dark">
          Lieu de l'accident
        </label>
        <div className="relative">
          <Input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => {
              handleInputChange(e);
              // Reset geocoding status when user types
              if (geocodingStatus !== 'none') {
                setGeocodingStatus('none');
              }
            }}
            placeholder="Adresse ou description du lieu"
            className="pl-10"
            required
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
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
        <div className={`p-4 rounded-lg ${
          geocodingStatus === 'success' ? 'bg-green-50 border border-green-200' : 
          geocodingStatus === 'error' ? 'bg-red-50 border border-red-200' : 
          'bg-constalib-light-blue/30'
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium text-constalib-dark flex items-center">
                <MapPin className="h-4 w-4 mr-1 inline" /> Localisation
                {geocodingStatus === 'success' && (
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                    Validée
                  </Badge>
                )}
              </h4>
              <p className="text-sm text-constalib-dark break-words">
                {formattedAddress || `Lat: ${currentLocation.lat.toFixed(6)}, Lng: ${currentLocation.lng.toFixed(6)}`}
              </p>
            </div>
            
            {geocodingStatus !== 'none' && (
              <Button
                size="icon"
                variant="ghost"
                onClick={geocodeAddress}
                className="h-8 w-8"
                title="Actualiser la géolocalisation"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationStep;
