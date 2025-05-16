
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
  
  const removePhoto = (type: 'vehiclePhotos' | 'damagePhotos', index: number) => {
    if (type === 'vehiclePhotos') {
      setVehiclePhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setDamagePhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  return {
    vehiclePhotos,
    damagePhotos,
    handlePhotoUpload,
    removePhoto,
    getPhotosData: () => ({
      vehiclePhotos,
      damagePhotos
    })
  };
};
