import React from 'react';

export interface LocationStepProps {
  date: string;
  time: string;
  location: string;
  geolocation: {
    lat: number;
    lng: number;
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
  const handleMapClick = (lat: number, lng: number, address: string) => {
    setGeolocation({
      lat,
      lng,
      address
    });
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

      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-constalib-dark mb-2">Localisation sur la carte</h3>
        <div className="h-64 bg-gray-200 rounded-md mb-2 relative">
          {/* Map component would go here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Carte de localisation</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {geolocation.address ? (
            <p>Adresse sélectionnée: {geolocation.address}</p>
          ) : (
            <p>Cliquez sur la carte pour sélectionner l'emplacement exact de l'accident</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Conseil</h4>
        <p className="text-sm text-blue-700">
          Soyez aussi précis que possible concernant le lieu de l'accident. 
          Incluez le nom de la rue, le numéro, la ville et toute information 
          supplémentaire qui pourrait aider à localiser l'accident avec précision.
        </p>
      </div>
    </div>
  );
};

export default LocationStep;
