
import { useState } from 'react';
import { Search, AlertCircle, Loader2, Check, Info, Car, Shield } from 'lucide-react';
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
  insurance?: {
    company: string;
    policy: string;
    name: string;
  };
}

interface InsuranceData {
  company: string;
  name?: string;
  logo?: string;
}

interface VehicleIdentificationStepProps {
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleDescription: string;
  insurancePolicy?: string;
  insuranceCompany?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setVehicleInfo: (data: {brand: string, model: string, year: string, firstRegistration?: string}) => void;
  setInsuranceInfo?: (data: {company: string}) => void;
}

const VehicleIdentificationStep = ({
  licensePlate,
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  vehicleDescription,
  insurancePolicy = '',
  insuranceCompany = '',
  handleInputChange,
  setVehicleInfo,
  setInsuranceInfo
}: VehicleIdentificationStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupSuccess, setLookupSuccess] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isInsuranceLoading, setIsInsuranceLoading] = useState(false);
  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceData | null>(null);
  const [insuranceLookupSuccess, setInsuranceLookupSuccess] = useState(false);
  const [insuranceError, setInsuranceError] = useState<string | null>(null);
  const [autoInsuranceFound, setAutoInsuranceFound] = useState(false);

  const lookupVehicle = async () => {
    if (!licensePlate || licensePlate.length < 5) {
      toast.error("Veuillez saisir une immatriculation valide");
      setSearchError("L'immatriculation doit contenir au moins 5 caractères");
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    setLookupSuccess(false);
    setAutoInsuranceFound(false);
    
    try {
      console.log(`Tentative de recherche du véhicule: ${licensePlate}`);
      const { data, error } = await supabase.functions.invoke('lookup-vehicle', {
        body: { licensePlate }
      });

      if (error) {
        console.error('Error looking up vehicle:', error);
        toast.error("Erreur lors de la consultation du SIV");
        setSearchError("Une erreur technique est survenue lors de la consultation du SIV");
        return;
      }

      if (data.success && data.data) {
        console.log('Véhicule trouvé:', data.data);
        setVehicleInfo(data.data);
        setVehicleDetails(data.data);
        setLookupSuccess(true);
        toast.success(data.message || "Informations du véhicule récupérées avec succès du SIV");
        
        // Si des informations d'assurance sont disponibles, les remplir automatiquement
        if (data.data.insurance) {
          setAutoInsuranceFound(true);
          setInsuranceDetails({
            company: data.data.insurance.company,
            name: data.data.insurance.name
          });
          
          // Remplissage du numéro de police
          const policyEvent = {
            target: {
              name: 'insurancePolicy',
              value: data.data.insurance.policy
            }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(policyEvent);
          
          // Remplissage de la compagnie d'assurance
          const companyEvent = {
            target: {
              name: 'insuranceCompany',
              value: data.data.insurance.company
            }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(companyEvent);
          
          if (setInsuranceInfo) {
            setInsuranceInfo({ company: data.data.insurance.company });
          }
          
          setInsuranceLookupSuccess(true);
          toast.success("Informations d'assurance récupérées automatiquement");
        }
      } else {
        console.log('Véhicule non trouvé:', data);
        setSearchError(data.message || "Aucun véhicule trouvé avec cette immatriculation dans le SIV");
        toast.error(data.message || "Aucun véhicule trouvé avec cette immatriculation dans le SIV");
      }
    } catch (err) {
      console.error('Error in vehicle lookup:', err);
      setSearchError("Une erreur est survenue lors de la consultation du SIV");
      toast.error("Une erreur est survenue lors de la consultation du SIV");
    } finally {
      setIsLoading(false);
    }
  };

  const lookupInsurance = async () => {
    if (!insurancePolicy) {
      toast.error("Veuillez saisir un numéro de police d'assurance");
      setInsuranceError("Le numéro de police d'assurance est requis");
      return;
    }

    setIsInsuranceLoading(true);
    setInsuranceError(null);
    setInsuranceLookupSuccess(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('lookup-insurance', {
        body: { policyNumber: insurancePolicy }
      });

      if (error) {
        toast.error("Erreur lors de la consultation du fichier des assurances");
        setInsuranceError("Une erreur technique est survenue lors de la consultation");
        console.error('Error looking up insurance:', error);
        return;
      }

      if (data.success && data.data) {
        if (setInsuranceInfo) {
          setInsuranceInfo({ company: data.data.company });
        }
        
        const syntheticEvent = {
          target: {
            name: 'insuranceCompany',
            value: data.data.company
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(syntheticEvent);
        
        setInsuranceDetails(data.data);
        setInsuranceLookupSuccess(true);
        toast.success(data.message || "Informations d'assurance récupérées avec succès");
      } else {
        setInsuranceError(data.message || "Aucune assurance trouvée avec ce numéro de police");
        toast.error(data.message || "Aucune assurance trouvée avec ce numéro de police");
      }
    } catch (err) {
      console.error('Error in insurance lookup:', err);
      setInsuranceError("Une erreur est survenue lors de la consultation");
      toast.error("Une erreur est survenue lors de la consultation");
    } finally {
      setIsInsuranceLoading(false);
    }
  };

  const formatLicensePlate = (value: string) => {
    let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (formatted.length <= 7) { // New format
      if (formatted.length > 2 && formatted.length <= 5) {
        formatted = formatted.substring(0, 2) + '-' + formatted.substring(2);
      } else if (formatted.length > 5) {
        formatted = formatted.substring(0, 2) + '-' + formatted.substring(2, 5) + '-' + formatted.substring(5);
      }
    } else if (formatted.length > 3 && formatted.length <= 6) { // Old format
      formatted = formatted.substring(0, 3) + ' ' + formatted.substring(3);
    }
    
    return formatted;
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatLicensePlate(e.target.value);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue,
        name: 'licensePlate'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
    
    if (lookupSuccess) {
      setLookupSuccess(false);
    }
    
    if (autoInsuranceFound) {
      setAutoInsuranceFound(false);
      setInsuranceLookupSuccess(false);
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
            placeholder="AB-123-CD ou 123 ABC"
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
            title="Consulter le SIV (Système d'Immatriculation des Véhicules)"
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
          Format: AB-123-CD (nouveau) ou 123 ABC (ancien). Cliquez sur la loupe pour consulter le SIV (Système d'Immatriculation des Véhicules).
        </p>
        
        {searchError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}
        
        {lookupSuccess && vehicleDetails && (
          <Alert className="mt-2 border-green-200 bg-green-50">
            <Car className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Véhicule identifié dans le SIV : {vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})
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

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium text-constalib-dark mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-constalib-blue" />
          Informations d'assurance
          {autoInsuranceFound && (
            <span className="ml-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Auto-détectée
            </span>
          )}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="insurancePolicy" className="block text-sm font-medium text-constalib-dark">
              Numéro de police d'assurance
            </label>
            <div className="relative">
              <Input
                type="text"
                id="insurancePolicy"
                name="insurancePolicy"
                value={insurancePolicy}
                onChange={handleInputChange}
                placeholder="Ex: A12345678"
                className="pr-12"
              />
              <Button 
                type="button" 
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={lookupInsurance}
                disabled={isInsuranceLoading || autoInsuranceFound}
                title="Rechercher la compagnie d'assurance"
              >
                {isInsuranceLoading ? 
                  <Loader2 className="h-5 w-5 animate-spin text-constalib-blue" /> : 
                  insuranceLookupSuccess ? 
                    <Check className="h-5 w-5 text-green-600" /> :
                    <Search className="h-5 w-5 text-constalib-blue" />
                }
              </Button>
            </div>
            <p className="text-xs text-constalib-dark-gray">
              {autoInsuranceFound 
                ? "Numéro de police récupéré automatiquement du SIV" 
                : "Saisissez le numéro de police d'assurance tel qu'il apparaît sur votre carte verte"}
            </p>

            {insuranceError && !autoInsuranceFound && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{insuranceError}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="insuranceCompany" className="block text-sm font-medium text-constalib-dark">
              Compagnie d'assurance
            </label>
            <Input
              type="text"
              id="insuranceCompany"
              name="insuranceCompany"
              value={insuranceCompany}
              onChange={handleInputChange}
              placeholder="Ex: AXA, MAIF, etc."
              className="w-full"
              readOnly={insuranceLookupSuccess || autoInsuranceFound}
            />
            
            {(insuranceLookupSuccess || autoInsuranceFound) && insuranceDetails && (
              <Alert className="mt-2 border-green-200 bg-green-50">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Assurance identifiée : {insuranceDetails.company}
                  {insuranceDetails.name && 
                    <div className="text-xs mt-1">Contrat : {insuranceDetails.name}</div>
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 text-sm">
          Les informations récupérées par le SIV (Système d'Immatriculation des Véhicules) sont automatiquement renseignées dans le formulaire. Les informations d'assurance associées au véhicule sont également récupérées si disponibles, sinon vous pouvez les renseigner manuellement.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VehicleIdentificationStep;
