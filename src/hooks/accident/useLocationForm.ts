
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface GeolocationData {
  lat: number | null;
  lng: number | null;
  address: string;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationFormData {
  date: string;
  time: string;
  location: string;
  description: string;
  geolocation: GeolocationData;
}

export const useLocationForm = (initialData?: Partial<LocationFormData>) => {
  const [date, setDate] = useState<string>(initialData?.date || '');
  const [time, setTime] = useState<string>(initialData?.time || '');
  const [location, setLocation] = useState<string>(initialData?.location || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [geolocation, setGeolocation] = useState<GeolocationData>(
    initialData?.geolocation || {
      lat: null,
      lng: null,
      address: ''
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    switch(name) {
      case 'date':
        setDate(value);
        break;
      case 'time':
        setTime(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'description':
        setDescription(value);
        break;
    }
  };

  const handleSetGeolocation = useCallback((data: GeolocationData) => {
    console.log('Setting geolocation data:', data);
    setGeolocation(data);
    
    // Update the location input if address is provided and location is empty
    if (data.address && (!location || location.trim() === '')) {
      setLocation(data.address);
      toast.success('Adresse récupérée', {
        description: 'Le champ lieu a été automatiquement rempli'
      });
    }
  }, [location]);

  const clearGeolocation = useCallback(() => {
    setGeolocation({
      lat: null,
      lng: null,
      address: ''
    });
  }, []);

  return {
    date,
    time,
    location,
    description,
    geolocation,
    handleInputChange,
    setGeolocation: handleSetGeolocation,
    clearGeolocation,
    getLocationData: () => ({
      date,
      time,
      location,
      description,
      geolocation
    })
  };
};
