
import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import FreeGeoLocation from './FreeGeoLocation';
import LocationDisplay from './LocationDisplay';
import AccidentMap from './AccidentMap';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { GeolocationData } from './types';
import { Button } from "@/components/ui/button";

export interface LocationStepProps {
  date: string;
  time: string;
  location: string;
  description?: string;
  geolocation: GeolocationData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setGeolocation: (data: GeolocationData) => void;
  clearGeolocation?: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  date,
  time,
  location,
  description,
  geolocation,
  handleInputChange,
  setGeolocation,
  clearGeolocation
}) => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleGeolocationSuccess = (data: GeolocationData) => {
    setGeolocation(data);
    toast.success('Position localisée', {
      description: 'La position a été correctement géolocalisée'
    });
  };

  const handleClearGeolocation = () => {
    if (clearGeolocation) {
      clearGeolocation();
      toast.info('Localisation réinitialisée', {
        description: 'Les coordonnées GPS ont été effacées'
      });
    }
  };

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
        <label htmlFor="location" className="block text-sm font-medium text-constalib-dark mb-1">
          Lieu de l'accident
        </label>
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

      <FreeGeoLocation 
        setGeolocation={handleGeolocationSuccess}
        address={location} 
      />
      
      {geolocation.lat && geolocation.lng && (
        <div className="relative">
          <LocationDisplay geolocation={geolocation} setMapVisible={setIsMapVisible} />
          {clearGeolocation && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6" 
              onClick={handleClearGeolocation}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-constalib-dark mb-1">
          Description de l'accident (optionnel)
        </label>
        <textarea
          id="description"
          name="description"
          value={description || ''}
          onChange={handleInputChange}
          placeholder="Décrivez les circonstances de l'accident..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
        />
      </div>

      <Dialog open={isMapVisible} onOpenChange={setIsMapVisible}>
        <DialogContent className="sm:max-w-[700px] sm:max-h-[80vh] overflow-y-auto">
          <div className="p-2">
            <h2 className="text-xl font-semibold mb-4">Localisation de l'accident</h2>
            {geolocation.lat && geolocation.lng && (
              <AccidentMap 
                lat={geolocation.lat} 
                lng={geolocation.lng}
                address={geolocation.address}
                accuracy={geolocation.accuracy}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Conseil</h4>
        <p className="text-sm text-blue-700">
          Soyez aussi précis que possible concernant le lieu de l'accident. 
          Utilisez le bouton "Utiliser ma position actuelle" pour localiser automatiquement votre position
          ou saisissez une adresse et cliquez sur "Géolocaliser cette adresse".
        </p>
      </div>
    </div>
  );
};

export default LocationStep;
