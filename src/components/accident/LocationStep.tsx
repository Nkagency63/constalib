
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
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
            onChange={handleLocationInputChange}
            placeholder="Adresse ou description du lieu"
            className="pl-10"
            required
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
          Saisissez l'adresse précise ou décrivez le lieu de l'accident
        </p>
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
          const geocodeButton = document.querySelector('button:contains("Géolocaliser")') as HTMLButtonElement;
          if (geocodeButton) {
            geocodeButton.click();
          }
        }}
      />
    </div>
  );
};

export default LocationStep;
