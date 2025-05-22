
import { useState } from 'react';

export const usePhotosForm = (initialData?: any) => {
  const [vehiclePhotos, setVehiclePhotos] = useState<File[]>(initialData?.vehiclePhotos || []);
  const [damagePhotos, setDamagePhotos] = useState<File[]>(initialData?.damagePhotos || []);

  const handlePhotoUpload = (type: 'vehiclePhotos' | 'damagePhotos', file: File) => {
    if (type === 'vehiclePhotos') {
      setVehiclePhotos(prev => [...prev, file]);
    } else {
      setDamagePhotos(prev => [...prev, file]);
    }
  };

  return {
    vehiclePhotos,
    damagePhotos,
    handlePhotoUpload,
    getPhotosData: () => ({
      vehiclePhotos,
      damagePhotos
    })
  };
};
