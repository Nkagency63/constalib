
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
import DriversInsuredCard from './review/DriversInsuredCard';
import CerfaGenerationButton from './CerfaGenerationButton';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  const hasEmailRecipients = formData.personalEmail || formData.insuranceEmails.length > 0 || formData.involvedPartyEmails.length > 0;
  
  // Vérifier si les informations du conducteur/assuré sont définies et ont au moins un champ rempli
  const hasDriverAInfo = formData.driverA && Object.values(formData.driverA).some(val => val);
  const hasDriverBInfo = formData.driverB && Object.values(formData.driverB).some(val => val);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Vérifiez votre déclaration</h3>
        <p className="text-sm text-constalib-dark-gray">
          Voici un récapitulatif des informations que vous avez saisies. Vérifiez-les avant de soumettre votre déclaration.
        </p>
      </div>

      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700 text-sm">
          <strong>Nouveau!</strong> Vous pouvez désormais enregistrer officiellement votre constat (e-constat), 
          ce qui lui donnera une valeur juridique reconnue par les assurances.
          Un numéro unique de référence vous sera attribué.
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
        
        {hasDriverAInfo && formData.insuredA && (
          <DriversInsuredCard 
            vehicleId="A" 
            driver={formData.driverA} 
            insured={formData.insuredA} 
          />
        )}
        
        {hasDriverBInfo && formData.insuredB && (
          <DriversInsuredCard 
            vehicleId="B" 
            driver={formData.driverB} 
            insured={formData.insuredB} 
          />
        )}
        
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
