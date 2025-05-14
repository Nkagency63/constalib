
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import CurrentLocationButton from './CurrentLocationButton';
import GeocodingButton from './GeocodingButton';
import LocationDisplay from './LocationDisplay';
import AccidentMap from './AccidentMap';
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface LocationStepProps {
  date: string;
  time: string;
  location: string;
  geolocation: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setGeolocation: (data: { lat: number; lng: number; address: string }) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  date,
  time,
  location,
  geolocation,
  handleInputChange,
  setGeolocation
}) => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-constalib-dark mb-1">
            Date de l'accident
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-constalib-dark mb-1">
            Heure de l'accident
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={time}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="location" className="block text-sm font-medium text-constalib-dark mb-1">
            Lieu de l'accident
          </label>
          <GeocodingButton location={location} setGeolocation={setGeolocation} />
        </div>
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={handleInputChange}
          placeholder="Adresse, ville, code postal..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <CurrentLocationButton setGeolocation={setGeolocation} />
      
      {geolocation.lat && geolocation.lng && (
        <LocationDisplay geolocation={geolocation} setMapVisible={setIsMapVisible} />
      )}

      <Dialog open={isMapVisible} onOpenChange={setIsMapVisible}>
        <DialogContent className="sm:max-w-[700px] sm:max-h-[80vh] overflow-y-auto">
          <div className="p-2">
            <h2 className="text-xl font-semibold mb-4">Localisation de l'accident</h2>
            {geolocation.lat && geolocation.lng && (
              <AccidentMap 
                lat={geolocation.lat} 
                lng={geolocation.lng}
                address={geolocation.address}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Conseil</h4>
        <p className="text-sm text-blue-700">
          Soyez aussi précis que possible concernant le lieu de l'accident. 
          Utilisez le bouton "Utiliser ma position actuelle" pour localiser automatiquement votre position.
          Vous pouvez également saisir manuellement une adresse et la géolocaliser.
        </p>
      </div>
    </div>
  );
};

export default LocationStep;
