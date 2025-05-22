
import { useState } from 'react';

export const useLocationForm = (initialData?: any) => {
  const [date, setDate] = useState<string>(initialData?.date || '');
  const [time, setTime] = useState<string>(initialData?.time || '');
  const [location, setLocation] = useState<string>(initialData?.location || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [geolocation, setGeolocation] = useState<{lat: number | null, lng: number | null, address: string}>(
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

  const handleSetGeolocation = (data: {lat: number, lng: number, address: string}) => {
    setGeolocation(data);
  };

  return {
    date,
    time,
    location,
    description,
    geolocation,
    handleInputChange,
    setGeolocation: handleSetGeolocation,
    getLocationData: () => ({
      date,
      time,
      location,
      description,
      geolocation
    })
  };
};
