
export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface FormData {
  date: string;
  time: string;
  location: string;
  description: string;
  vehiclePhotos: File[];
  damagePhotos: File[];
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  geolocation: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  emergencyContacted: boolean;
}
