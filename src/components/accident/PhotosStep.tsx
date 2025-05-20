
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';

interface PhotosStepProps {
  handlePhotoUpload: (type: string, files: File[]) => void;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ handlePhotoUpload }) => {
  // Handle vehicle photo upload
  const handleVehiclePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to File array
      const filesArray = Array.from(e.target.files);
      handlePhotoUpload('vehicle', filesArray);
    }
  };
  
  // Handle damage photo upload
  const handleDamagePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to File array
      const filesArray = Array.from(e.target.files);
      handlePhotoUpload('damage', filesArray);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Photos des véhicules</h3>
        <p className="text-sm text-gray-600 mb-4">
          Prenez des photos des véhicules impliqués dans l'accident sous différents angles.
        </p>
        
        <div className="flex justify-center">
          <div className="relative">
            <input
              type="file"
              id="vehiclePhotos"
              accept="image/*"
              multiple
              onChange={handleVehiclePhotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Ajouter des photos des véhicules
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Photos des dommages</h3>
        <p className="text-sm text-gray-600 mb-4">
          Prenez des photos détaillées des dommages causés aux véhicules et à d'autres biens.
        </p>
        
        <div className="flex justify-center">
          <div className="relative">
            <input
              type="file"
              id="damagePhotos"
              accept="image/*"
              multiple
              onChange={handleDamagePhotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Ajouter des photos des dommages
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Conseil:</strong> Assurez-vous que vos photos sont claires et montrent bien l'étendue des dégâts.
          Prenez des photos sous plusieurs angles et avec un bon éclairage si possible.
        </p>
      </div>
    </div>
  );
};

export default PhotosStep;
