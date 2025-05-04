
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  const hasEmailRecipients = formData.personalEmail || formData.insuranceEmails.length > 0 || formData.involvedPartyEmails.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Verify Your Report</h3>
        <p className="text-sm text-constalib-dark-gray">
          Here's a summary of the information you've provided. Please verify it before submitting your report.
        </p>
      </div>

      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700 text-sm">
          <strong>New!</strong> You can now officially register your accident report (e-constat), 
          giving it legal value recognized by insurance companies.
          A unique reference number will be assigned to you.
        </AlertDescription>
      </Alert>

      <Alert variant="default" className="bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700 text-sm">
          The PDF will include your accident scheme and all information automatically filled in. 
          You can download the CERFA for your records or register it officially with insurance companies.
        </AlertDescription>
      </Alert>

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
      
      <div className="mt-6">
        <CerfaGenerationButton formData={formData} className="" />
      </div>
    </div>
  );
};

export default ReviewStep;
