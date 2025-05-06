
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Check } from "lucide-react";
import { useState } from "react";

interface VehicleInfoFieldsProps {
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly: boolean;
}

const VehicleInfoFields = ({
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  vehicleDescription,
  handleInputChange,
  readOnly
}: VehicleInfoFieldsProps) => {
  const [isEditing, setIsEditing] = useState(!readOnly);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-constalib-dark">Informations du véhicule</h3>
        {readOnly && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEditToggle} 
            className="flex items-center gap-1"
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4" />
                <span>Confirmer</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="vehicleBrand" className="block text-sm font-medium text-constalib-dark">
            Marque
          </label>
          <Input
            type="text"
            id="vehicleBrand"
            name="vehicleBrand"
            value={vehicleBrand}
            onChange={handleInputChange}
            className="w-full"
            readOnly={readOnly && !isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="vehicleModel" className="block text-sm font-medium text-constalib-dark">
            Modèle
          </label>
          <Input
            type="text"
            id="vehicleModel"
            name="vehicleModel"
            value={vehicleModel}
            onChange={handleInputChange}
            className="w-full"
            readOnly={readOnly && !isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="vehicleYear" className="block text-sm font-medium text-constalib-dark">
            Année
          </label>
          <Input
            type="text"
            id="vehicleYear"
            name="vehicleYear"
            value={vehicleYear}
            onChange={handleInputChange}
            className="w-full"
            readOnly={readOnly && !isEditing}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="vehicleDescription" className="block text-sm font-medium text-constalib-dark">
          Description du véhicule
        </label>
        <Textarea
          id="vehicleDescription"
          name="vehicleDescription"
          value={vehicleDescription}
          onChange={handleInputChange}
          placeholder="Décrivez votre véhicule (couleur, caractéristiques particulières, etc.)"
          rows={3}
          readOnly={readOnly && !isEditing}
        />
      </div>
    </>
  );
};

export default VehicleInfoFields;
