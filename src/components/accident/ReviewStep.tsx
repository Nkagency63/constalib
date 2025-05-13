import React from 'react';
import { FormData } from '../types';
import VehicleCard from './review/VehicleCard';
import OtherVehicleCard from './review/OtherVehicleCard';
import LocationCard from './review/LocationCard';
import CircumstancesCard from './review/CircumstancesCard';
import DetailsCard from './review/DetailsCard';
import DescriptionCard from './review/DescriptionCard';
import PhotoEvidenceCard from './review/PhotoEvidenceCard';
import SchemeReviewCard from './review/SchemeReviewCard';
import CerfaGenerationButton from '../CerfaGenerationButton';
import SignatureSection from './SignatureSection';

interface ReviewStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoUpload: (type: 'vehicle' | 'damage', files: FileList) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, handleInputChange, handlePhotoUpload }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Récapitulatif de la déclaration</h2>

      <VehicleCard
        vehicle={{
          licensePlate: formData.licensePlate || "",
          brand: formData.vehicleBrand || "",
          model: formData.vehicleModel || "",
          year: formData.vehicleYear || "",
          description: formData.vehicleDescription || "",
          insurancePolicy: formData.insurancePolicy,
          insuranceCompany: formData.insuranceCompany,
        }}
      />

      <OtherVehicleCard
        vehicle={{
          licensePlate: formData.otherVehicle.licensePlate || "",
          brand: formData.otherVehicle.brand || "",
          model: formData.otherVehicle.model || "",
          year: formData.otherVehicle.year || "",
          description: formData.otherVehicle.description || "",
          insurancePolicy: formData.otherVehicle.insurancePolicy,
          insuranceCompany: formData.otherVehicle.insuranceCompany,
        }}
      />

      <LocationCard formData={formData} />

      <CircumstancesCard formData={formData} />

      <DetailsCard formData={formData} />

      <DescriptionCard formData={formData} />

      <PhotoEvidenceCard
        formData={formData}
        handleInputChange={handleInputChange}
        handlePhotoUpload={handlePhotoUpload}
      />

      <SchemeReviewCard formData={formData} />
      
      <SignatureSection />

      <CerfaGenerationButton formData={formData} />
    </div>
  );
};

export default ReviewStep;
