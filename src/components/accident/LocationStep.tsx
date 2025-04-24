
import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import GeocodingButton from './GeocodingButton';
import CurrentLocationButton from './CurrentLocationButton';
import LocationDisplay from './LocationDisplay';

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
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [geocodingStatus, setGeocodingStatus] = useState<'none' | 'success' | 'error'>('none');

  const handleGeocodeSuccess = (data: {lat: number, lng: number, address: string}) => {
    setGeolocation(data);
    setCurrentLocation({
      lat: data.lat,
      lng: data.lng
    });
    setFormattedAddress(data.address);
    setGeocodingStatus('success');
  };

  const handleGeocodeError = () => {
    setGeocodingStatus('error');
  };

  const handleGeocodeStart = () => {
    setGeocodingStatus('none');
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    // Reset geocoding status when user types
    if (geocodingStatus !== 'none') {
      setGeocodingStatus('none');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const geocodeButton = document.querySelector('button[data-geocode-button]') as HTMLButtonElement;
      if (geocodeButton) {
        geocodeButton.click();
      }
    }
  };

  useEffect(() => {
    // If location changes externally, reset the geocoding status
    setGeocodingStatus('none');
  }, [location]);

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-constalib-light-blue/10">
        <h3 className="font-medium text-constalib-dark mb-2">Comment localiser votre accident ?</h3>
        <p className="text-sm text-constalib-dark-gray">
          Vous pouvez soit <strong>saisir l'adresse précise</strong> et cliquer sur "Géolocaliser", soit utiliser votre 
          position actuelle en cliquant sur le bouton ci-dessous.
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium text-constalib-dark">
          Adresse de l'accident
        </label>
        <div className="relative">
          <Input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={handleLocationInputChange}
            placeholder="Ex: 15 rue de Paris, 75001 Paris"
            className="pl-10"
            required
            onKeyPress={handleKeyPress}
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <GeocodingButton
              location={location}
              onGeocodeSuccess={handleGeocodeSuccess}
              onGeocodeError={handleGeocodeError}
              onGeocodeStart={handleGeocodeStart}
            />
          </div>
        </div>
        <p className="text-sm text-constalib-dark-gray mt-1">
          Saisissez l'adresse la plus précise possible pour une localisation exacte
        </p>
      </div>
      
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-200"></div>
        <span className="px-3 text-xs text-gray-500 bg-white">OU</span>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>
      
      <CurrentLocationButton
        onLocationSuccess={handleGeocodeSuccess}
        onLocationError={handleGeocodeError}
        onLocationStart={handleGeocodeStart}
      />
      
      <LocationDisplay
        currentLocation={currentLocation}
        formattedAddress={formattedAddress}
        geocodingStatus={geocodingStatus}
        onRefresh={() => {
          if (location) {
            const geocodeButton = document.querySelector('button[data-geocode-button]') as HTMLButtonElement;
            if (geocodeButton) {
              geocodeButton.click();
            }
          }
        }}
      />
    </div>
  );
};

export default LocationStep;
