
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { FormData } from './types';
import DateTimeCard from './review/DateTimeCard';
import LocationCard from './review/LocationCard';
import VehicleCard from './review/VehicleCard';
import OtherVehicleCard from './review/OtherVehicleCard';
import DescriptionCard from './review/DescriptionCard';
import EmailsCard from './review/EmailsCard';
import PhotosCard from './review/PhotosCard';
import EmergencyCard from './review/EmergencyCard';
import ReviewInfoAlert from './review/ReviewInfoAlert';
import CerfaGenerationButton from './CerfaGenerationButton';
import SignatureSection from './review/SignatureSection';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  const [signatures, setSignatures] = useState<{ partyA: string | null; partyB: string | null }>({
    partyA: null,
    partyB: null
  });
  
  const handleSignaturesUpdate = (newSignatures: { partyA: string | null; partyB: string | null }) => {
    setSignatures(newSignatures);
  };

  // Determine if both signatures are present
  const bothPartiesSigned = Boolean(signatures.partyA && signatures.partyB);
  
  return (
    <div className="space-y-6">
      <ReviewInfoAlert />
      
      <h3 className="text-xl font-semibold text-constalib-dark">Résumé de la déclaration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateTimeCard date={formData.date} time={formData.time} />
        <LocationCard location={formData.location} geolocation={formData.geolocation} />
      </div>
      
      <Separator className="my-6" />
      
      <h3 className="text-xl font-semibold text-constalib-dark">Véhicules impliqués</h3>
      <div className="space-y-4">
        <VehicleCard formData={formData} />
        <OtherVehicleCard otherVehicle={formData.otherVehicle} />
      </div>
      
      <Separator className="my-6" />
      
      <h3 className="text-xl font-semibold text-constalib-dark">Détails de l'accident</h3>
      <div className="space-y-4">
        <DescriptionCard 
          description={formData.description} 
          hasInjuries={formData.hasInjuries}
          injuriesDescription={formData.injuriesDescription}
          hasWitnesses={formData.hasWitnesses}
          witnesses={formData.witnesses}
        />
        <EmergencyCard emergencyContacted={formData.emergencyContacted} />
      </div>
      
      <Separator className="my-6" />
      
      <PhotosCard 
        vehiclePhotos={formData.vehiclePhotos} 
        damagePhotos={formData.damagePhotos} 
      />
      
      <Separator className="my-6" />
      
      <EmailsCard
        personalEmail={formData.personalEmail}
        insuranceEmails={formData.insuranceEmails}
        involvedPartyEmails={formData.involvedPartyEmails}
      />
      
      {/* Signature Section */}
      <SignatureSection onSignaturesUpdate={handleSignaturesUpdate} />
      
      <Separator className="my-6" />
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <CerfaGenerationButton 
          formData={formData} 
          signatures={bothPartiesSigned ? signatures : undefined} 
        />
        
        {!bothPartiesSigned && (
          <p className="text-amber-600 text-sm mt-2 text-center">
            Les deux signatures sont nécessaires pour l'enregistrement officiel du constat
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
