
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  return (
    <>
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
            readOnly={readOnly}
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
            readOnly={readOnly}
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
            readOnly={readOnly}
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
        />
      </div>
    </>
  );
};

export default VehicleInfoFields;
