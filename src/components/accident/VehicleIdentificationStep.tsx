
import { useState } from 'react';
import { Search, AlertCircle, Loader2, Check, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Alert,
  AlertDescription
} from "@/components/ui/alert";

interface VehicleData {
  brand: string;
  model: string;
  year: string;
  firstRegistration?: string;
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
  const [lookupSuccess, setLookupSuccess] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const lookupVehicle = async () => {
    if (!licensePlate || licensePlate.length < 5) {
      toast.error("Veuillez saisir une immatriculation valide");
      setSearchError("L'immatriculation doit contenir au moins 5 caractères");
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    setLookupSuccess(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('lookup-vehicle', {
        body: { licensePlate }
      });

      if (error) {
        toast.error("Erreur lors de la recherche du véhicule");
        setSearchError("Une erreur technique est survenue lors de la consultation du fichier central");
        console.error('Error looking up vehicle:', error);
        return;
      }

      if (data.success && data.data) {
        setVehicleInfo(data.data);
        setVehicleDetails(data.data);
        setLookupSuccess(true);
        toast.success(data.message || "Informations du véhicule récupérées avec succès");
      } else {
        setSearchError(data.message || "Aucun véhicule trouvé avec cette immatriculation");
        toast.error(data.message || "Aucun véhicule trouvé avec cette immatriculation");
      }
    } catch (err) {
      console.error('Error in vehicle lookup:', err);
      setSearchError("Une erreur est survenue lors de la consultation du fichier central");
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const formatLicensePlate = (value: string) => {
    // Format as AA-123-BB
    let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (formatted.length > 2 && formatted.length <= 5) {
      formatted = formatted.substring(0, 2) + '-' + formatted.substring(2);
    } else if (formatted.length > 5) {
      formatted = formatted.substring(0, 2) + '-' + formatted.substring(2, 5) + '-' + formatted.substring(5, 7);
    }
    
    return formatted;
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatLicensePlate(e.target.value);
    
    // Create a synthetic event to pass to the parent's handleInputChange
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue,
        name: 'licensePlate'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
    
    // Reset lookup state when input changes
    if (lookupSuccess) {
      setLookupSuccess(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="licensePlate" className="block text-sm font-medium text-constalib-dark">
          Immatriculation du véhicule
        </label>
        <div className="relative">
          <Input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={licensePlate}
            onChange={handleLicensePlateChange}
            placeholder="AB-123-CD"
            className="pr-12"
            maxLength={9}
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
              lookupSuccess ? 
                <Check className="h-5 w-5 text-green-600" /> :
                <Search className="h-5 w-5 text-constalib-blue" />
            }
          </Button>
        </div>
        <p className="text-xs text-constalib-dark-gray">
          Format: AB-123-CD. Cliquez sur la loupe pour consulter le fichier central des immatriculations.
        </p>
        
        {searchError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}
        
        {lookupSuccess && vehicleDetails && (
          <Alert className="mt-2 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Véhicule identifié : {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
              {vehicleDetails.firstRegistration && 
                <div className="text-xs mt-1">Date de première immatriculation : {vehicleDetails.firstRegistration}</div>
              }
            </AlertDescription>
          </Alert>
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
            readOnly={lookupSuccess}
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
            readOnly={lookupSuccess}
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
            readOnly={lookupSuccess}
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

      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 text-sm">
          Les informations récupérées par le fichier central des immatriculations sont automatiquement renseignées dans le formulaire. Vous pouvez compléter avec la description et les spécificités de votre véhicule.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VehicleIdentificationStep;
