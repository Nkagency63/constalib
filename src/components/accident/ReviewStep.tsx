
import { FormData } from './types';
import ReviewInfoAlert from './review/ReviewInfoAlert';
import DateTimeCard from './review/DateTimeCard';
import LocationCard from './review/LocationCard';
import VehicleCard from './review/VehicleCard';
import OtherVehicleCard from './review/OtherVehicleCard';
import DescriptionCard from './review/DescriptionCard';
import PhotosCard from './review/PhotosCard';
import EmailsCard from './review/EmailsCard';
import EmergencyCard from './review/EmergencyCard';
import CerfaGenerationButton from './CerfaGenerationButton';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  const hasEmailRecipients = formData.personalEmail || formData.insuranceEmails.length > 0 || formData.involvedPartyEmails.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Vérifiez votre déclaration</h3>
        <p className="text-sm text-constalib-dark-gray">
          Voici un récapitulatif des informations que vous avez saisies. Vérifiez-les avant de soumettre votre déclaration.
        </p>
      </div>

      <ReviewInfoAlert />
      
      <div className="space-y-4">
        <DateTimeCard date={formData.date} time={formData.time} />
        
        <LocationCard location={formData.location} geolocation={formData.geolocation} />
        
        <VehicleCard 
          licensePlate={formData.licensePlate}
          brand={formData.vehicleBrand}
          model={formData.vehicleModel}
          year={formData.vehicleYear}
          description={formData.vehicleDescription}
          insurancePolicy={formData.insurancePolicy}
          insuranceCompany={formData.insuranceCompany}
        />
        
        <OtherVehicleCard otherVehicle={formData.otherVehicle} />
        
        <DescriptionCard description={formData.description} />
        
        <PhotosCard 
          vehiclePhotos={formData.vehiclePhotos} 
          damagePhotos={formData.damagePhotos} 
        />
        
        {hasEmailRecipients && (
          <EmailsCard 
            personalEmail={formData.personalEmail}
            insuranceEmails={formData.insuranceEmails}
            involvedPartyEmails={formData.involvedPartyEmails}
          />
        )}
        
        <EmergencyCard emergencyContacted={formData.emergencyContacted} />
      </div>
      
      <div className="flex justify-center mt-6">
        <CerfaGenerationButton formData={formData} className="w-full md:w-auto" />
      </div>
    </div>
  );
};

export default ReviewStep;
