
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface GeolocationData {
  lat: number | null;
  lng: number | null;
  address: string;
  accuracy?: number;
  timestamp?: number;
}

export interface DriverInfo {
  name: string;
  address: string;
  phone: string;
  license: string;
}

export interface InsuredInfo {
  name: string;
  address: string;
  phone: string;
}

export interface LocationFormData {
  date: string;
  time: string;
  location: string;
  description: string;
  geolocation: GeolocationData;
  driver?: DriverInfo;
  insured?: InsuredInfo;
  otherDriver?: DriverInfo;
  otherInsured?: InsuredInfo;
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
  
  // Driver and insured information for vehicle A (user's vehicle)
  const [driver, setDriver] = useState<DriverInfo>(initialData?.driver || {
    name: '',
    address: '',
    phone: '',
    license: ''
  });
  
  const [insured, setInsured] = useState<InsuredInfo>(initialData?.insured || {
    name: '',
    address: '',
    phone: ''
  });
  
  // Driver and insured information for vehicle B (other vehicle)
  const [otherDriver, setOtherDriver] = useState<DriverInfo>(initialData?.otherDriver || {
    name: '',
    address: '',
    phone: '',
    license: ''
  });
  
  const [otherInsured, setOtherInsured] = useState<InsuredInfo>(initialData?.otherInsured || {
    name: '',
    address: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Basic fields
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
      
      // Driver fields for vehicle A
      case 'driverName':
        setDriver(prev => ({ ...prev, name: value }));
        break;
      case 'driverAddress':
        setDriver(prev => ({ ...prev, address: value }));
        break;
      case 'driverPhone':
        setDriver(prev => ({ ...prev, phone: value }));
        break;
      case 'driverLicense':
        setDriver(prev => ({ ...prev, license: value }));
        break;
      
      // Insured fields for vehicle A
      case 'insuredName':
        setInsured(prev => ({ ...prev, name: value }));
        break;
      case 'insuredAddress':
        setInsured(prev => ({ ...prev, address: value }));
        break;
      case 'insuredPhone':
        setInsured(prev => ({ ...prev, phone: value }));
        break;
      
      // Driver fields for vehicle B
      case 'otherDriverName':
        setOtherDriver(prev => ({ ...prev, name: value }));
        break;
      case 'otherDriverAddress':
        setOtherDriver(prev => ({ ...prev, address: value }));
        break;
      case 'otherDriverPhone':
        setOtherDriver(prev => ({ ...prev, phone: value }));
        break;
      case 'otherDriverLicense':
        setOtherDriver(prev => ({ ...prev, license: value }));
        break;
      
      // Insured fields for vehicle B
      case 'otherInsuredName':
        setOtherInsured(prev => ({ ...prev, name: value }));
        break;
      case 'otherInsuredAddress':
        setOtherInsured(prev => ({ ...prev, address: value }));
        break;
      case 'otherInsuredPhone':
        setOtherInsured(prev => ({ ...prev, phone: value }));
        break;
    }
  };

  // Function to copy driver info to insured info for vehicle A
  const copyDriverToInsured = () => {
    setInsured({
      name: driver.name,
      address: driver.address,
      phone: driver.phone
    });
    
    toast.success("Informations copiées", {
      description: "Les informations du conducteur ont été copiées vers l'assuré"
    });
  };
  
  // Function to copy driver info to insured info for vehicle B
  const copyOtherDriverToInsured = () => {
    setOtherInsured({
      name: otherDriver.name,
      address: otherDriver.address,
      phone: otherDriver.phone
    });
    
    toast.success("Informations copiées", {
      description: "Les informations du conducteur ont été copiées vers l'assuré"
    });
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
    driver,
    insured,
    otherDriver,
    otherInsured,
    handleInputChange,
    setGeolocation: handleSetGeolocation,
    clearGeolocation,
    copyDriverToInsured,
    copyOtherDriverToInsured,
    getLocationData: () => ({
      date,
      time,
      location,
      description,
      geolocation,
      driver,
      insured,
      otherDriver,
      otherInsured
    })
  };
};
