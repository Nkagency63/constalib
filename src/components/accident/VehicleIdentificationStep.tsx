
import { useState } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface VehicleData {
  brand: string;
  model: string;
  year: string;
}

interface VehicleIdentificationStepProps {
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string}) => void;
}

const VehicleIdentificationStep = ({
  licensePlate,
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  vehicleDescription,
  handleInputChange,
  setVehicleInfo
}: VehicleIdentificationStepProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const lookupVehicle = async () => {
    if (!licensePlate || licensePlate.length < 5) {
      toast.error("Veuillez saisir une immatriculation valide");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lookup-vehicle', {
        body: { licensePlate }
      });

      if (error) {
        toast.error("Erreur lors de la recherche du véhicule");
        console.error('Error looking up vehicle:', error);
        return;
      }

      if (data.success && data.data) {
        setVehicleInfo(data.data);
        toast.success("Informations du véhicule récupérées avec succès");
      } else {
        toast.error(data.message || "Aucun véhicule trouvé avec cette immatriculation");
      }
    } catch (err) {
      console.error('Error in vehicle lookup:', err);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="licensePlate" className="block text-sm font-medium text-constalib-dark">
          Immatriculation du véhicule
        </label>
        <div className="relative">
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={licensePlate}
            onChange={handleInputChange}
            placeholder="AB-123-CD"
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
            required
          />
          <Button 
            type="button" 
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={lookupVehicle}
            disabled={isLoading}
          >
            {isLoading ? 
              <Loader2 className="h-5 w-5 animate-spin text-constalib-blue" /> : 
              <Search className="h-5 w-5 text-constalib-blue" />
            }
          </Button>
        </div>
        <p className="text-xs text-constalib-dark-gray">
          Exemple: AB-123-CD. Cliquez sur la loupe pour rechercher les informations du véhicule.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="vehicleBrand" className="block text-sm font-medium text-constalib-dark">
            Marque
          </label>
          <input
            type="text"
            id="vehicleBrand"
            name="vehicleBrand"
            value={vehicleBrand}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="vehicleModel" className="block text-sm font-medium text-constalib-dark">
            Modèle
          </label>
          <input
            type="text"
            id="vehicleModel"
            name="vehicleModel"
            value={vehicleModel}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="vehicleYear" className="block text-sm font-medium text-constalib-dark">
            Année
          </label>
          <input
            type="text"
            id="vehicleYear"
            name="vehicleYear"
            value={vehicleYear}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
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
          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
          rows={3}
        />
      </div>
    </div>
  );
};

export default VehicleIdentificationStep;
