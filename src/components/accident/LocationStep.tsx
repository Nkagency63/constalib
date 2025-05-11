
import { useState } from 'react';
import { Map, MapPin, Calendar, Clock } from 'lucide-react';
import AccidentMap from './AccidentMap';
import GeocodingButton from './GeocodingButton';
import CurrentLocationButton from './CurrentLocationButton';
import LocationDisplay from './LocationDisplay';

interface LocationStepProps {
  date: string;
  time: string;
  location?: string;
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setGeolocation: (data: {lat: number, lng: number, address: string}) => void;
}

const LocationStep = ({
  date,
  time,
  location = '',
  geolocation,
  handleInputChange,
  setGeolocation
}: LocationStepProps) => {
  const [mapVisible, setMapVisible] = useState(false);

  // Only render the map if we have valid coordinates and it's set to visible
  const shouldRenderMap = mapVisible && geolocation?.lat && geolocation?.lng;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-constalib-dark">
          Date de l'accident
        </label>
        <div className="relative">
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
            required
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="time" className="block text-sm font-medium text-constalib-dark">
          Heure de l'accident
        </label>
        <div className="relative">
          <input
            type="time"
            id="time"
            name="time"
            value={time}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
            required
          />
          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
        </div>
      </div>

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
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
            placeholder="Adresse, ville, code postal..."
            required
          />
          <Map className="absolute right-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
        </div>
      </div>

      <div className="flex gap-2">
        <GeocodingButton
          location={location}
          setGeolocation={setGeolocation}
        />
        <CurrentLocationButton
          setGeolocation={setGeolocation}
        />
      </div>

      {(geolocation?.lat && geolocation?.lng) ? (
        <LocationDisplay
          geolocation={geolocation}
          setMapVisible={setMapVisible}
        />
      ) : null}

      {shouldRenderMap && (
        <div className="mt-4 h-64 rounded-lg overflow-hidden border border-gray-200">
          <AccidentMap
            lat={geolocation.lat}
            lng={geolocation.lng}
            address={geolocation.address}
          />
        </div>
      )}
    </div>
  );
};

export default LocationStep;
