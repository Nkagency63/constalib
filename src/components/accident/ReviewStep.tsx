
import React from 'react';
import { FormData } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import VehicleCard from './review/VehicleCard';
import OtherVehicleCard from './review/OtherVehicleCard';
import LocationCard from './review/LocationCard';
import DateTimeCard from './review/DateTimeCard';
import EmailsCard from './review/EmailsCard';
import PhotosCard from './review/PhotosCard';
import DescriptionCard from './review/DescriptionCard';
import EmergencyCard from './review/EmergencyCard';
import ReviewInfoAlert from './review/ReviewInfoAlert';

interface ReviewStepProps {
  formData: FormData;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload?: (type: string, files: FileList) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  formData,
  handleInputChange,
  handlePhotoUpload
}) => {
  return (
    <div className="space-y-6">
      <ReviewInfoAlert />
      
      <div className="grid gap-6 md:grid-cols-2">
        <VehicleCard 
          licensePlate={formData.licensePlate}
          brand={formData.vehicleBrand}
          model={formData.vehicleModel}
          year={formData.vehicleYear}
          insuredName={formData.insuredName}
          driverName={formData.driverName}
          insuranceCompany={formData.insuranceCompany}
          insurancePolicy={formData.insurancePolicy}
        />
        
        <OtherVehicleCard 
          licensePlate={formData.otherVehicle?.licensePlate}
          brand={formData.otherVehicle?.brand}
          model={formData.otherVehicle?.model}
          year={formData.otherVehicle?.year}
          insuredName={formData.otherInsuredName}
          driverName={formData.otherDriverName}
          insuranceCompany={formData.otherVehicle?.insuranceCompany}
          insurancePolicy={formData.otherVehicle?.insurancePolicy}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <LocationCard 
          location={formData.location}
          address={formData.geolocation?.address}
          latitude={formData.geolocation?.lat}
          longitude={formData.geolocation?.lng}
        />
        
        <DateTimeCard 
          date={formData.date}
          time={formData.time}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <EmailsCard 
          personalEmail={formData.personalEmail}
          insuranceEmails={formData.insuranceEmails || []}
          involvedPartyEmails={formData.involvedPartyEmails || []}
        />
        
        {formData.emergencyContacted && (
          <EmergencyCard 
            emergencyContacted={formData.emergencyContacted}
          />
        )}
      </div>
      
      {(formData.materialDamageDescription || formData.injuriesDescription) && (
        <DescriptionCard
          formData={formData}
        />
      )}
      
      {(formData.vehiclePhotos?.length || formData.damagePhotos?.length) && (
        <PhotosCard
          vehiclePhotos={formData.vehiclePhotos || []}
          damagePhotos={formData.damagePhotos || []}
        />
      )}
      
      {!formData.date && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Les informations de base (date et lieu) sont manquantes. Veuillez les compléter avant de soumettre le formulaire.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReviewStep;
