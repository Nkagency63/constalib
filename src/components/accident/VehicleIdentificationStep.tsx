
import { useState } from 'react';
import { Search, AlertCircle, Loader2, Check, Info, Car, Shield, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface FvaData {
  vehicleInfo: {
    licensePlate: string;
    brand: string;
    model: string;
    vin: string;
    firstRegistration: string;
  };
  insuranceInfo: {
    company: string;
    policyNumber: string;
    contractName: string;
    validFrom: string;
    validUntil: string;
    guarantees: string[];
    insuredName: string;
    insuredAddress: string;
    insuredPhone: string;
    insuredEmail: string;
  };
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
  
  // États pour la consultation du FVA
  const [isFvaLoading, setIsFvaLoading] = useState(false);
  const [fvaData, setFvaData] = useState<FvaData | null>(null);
  const [fvaLookupSuccess, setFvaLookupSuccess] = useState(false);
  const [fvaError, setFvaError] = useState<string | null>(null);
  const [showFvaDetails, setShowFvaDetails] = useState(false);

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

  // Nouvelle fonction pour consulter le FVA
  const lookupFva = async () => {
    if (!licensePlate || licensePlate.length < 5) {
      toast.error("Veuillez saisir une immatriculation valide");
      setFvaError("L'immatriculation doit contenir au moins 5 caractères");
      return;
    }

    setIsFvaLoading(true);
    setFvaError(null);
    setFvaLookupSuccess(false);
    setFvaData(null);
    
    try {
      console.log(`Tentative de consultation du FVA pour: ${licensePlate}`);
      const { data, error } = await supabase.functions.invoke('lookup-fva', {
        body: { licensePlate }
      });

      if (error) {
        console.error('Error looking up FVA:', error);
        toast.error("Erreur lors de la consultation du FVA");
        setFvaError("Une erreur technique est survenue lors de la consultation du FVA");
        return;
      }

      if (data.success && data.data) {
        console.log('Données FVA trouvées:', data.data);
        setFvaData(data.data);
        setFvaLookupSuccess(true);
        toast.success(data.message || "Informations du FVA récupérées avec succès");
        
        // Mise à jour automatique des informations du véhicule
        const vehicleInfo = {
          brand: data.data.vehicleInfo.brand,
          model: data.data.vehicleInfo.model,
          year: data.data.vehicleInfo.firstRegistration.substring(0, 4),
          firstRegistration: data.data.vehicleInfo.firstRegistration
        };
        
        setVehicleInfo(vehicleInfo);
        setVehicleDetails(vehicleInfo);
        setLookupSuccess(true);
        
        // Mise à jour automatique des informations d'assurance
        const insuranceInfo = {
          company: data.data.insuranceInfo.company
        };
        
        if (setInsuranceInfo) {
          setInsuranceInfo(insuranceInfo);
        }
        
        // Remplissage du numéro de police
        const policyEvent = {
          target: {
            name: 'insurancePolicy',
            value: data.data.insuranceInfo.policyNumber
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(policyEvent);
        
        // Remplissage de la compagnie d'assurance
        const companyEvent = {
          target: {
            name: 'insuranceCompany',
            value: data.data.insuranceInfo.company
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(companyEvent);
        
        setInsuranceDetails({
          company: data.data.insuranceInfo.company,
          name: data.data.insuranceInfo.contractName
        });
        
        setAutoInsuranceFound(true);
        setInsuranceLookupSuccess(true);
      } else {
        console.log('Véhicule non trouvé dans le FVA:', data);
        setFvaError(data.message || "Aucune information trouvée dans le FVA pour cette immatriculation");
        toast.error(data.message || "Aucune information trouvée dans le FVA pour cette immatriculation");
      }
    } catch (err) {
      console.error('Error in FVA lookup:', err);
      setFvaError("Une erreur est survenue lors de la consultation du FVA");
      toast.error("Une erreur est survenue lors de la consultation du FVA");
    } finally {
      setIsFvaLoading(false);
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
    
    if (fvaLookupSuccess) {
      setFvaLookupSuccess(false);
      setFvaData(null);
    }
  };

  // Fonction pour formater une date au format français
  const formatDateFr = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="licensePlate" className="block text-sm font-medium text-constalib-dark">
          Immatriculation du véhicule
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
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
          <Button
            type="button"
            variant="outline"
            onClick={lookupFva}
            disabled={isFvaLoading || !licensePlate}
            className="shrink-0"
            title="Consulter le FVA (Fichier des Véhicules Assurés)"
          >
            {isFvaLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserCheck className="h-4 w-4 mr-2" />
            )}
            Vérifier FVA
          </Button>
        </div>
        <p className="text-xs text-constalib-dark-gray">
          Format: AB-123-CD (nouveau) ou 123 ABC (ancien). Utilisez le bouton "Vérifier FVA" pour consulter le Fichier des Véhicules Assurés.
        </p>
        
        {searchError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}
        
        {fvaError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fvaError}</AlertDescription>
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
        
        {fvaLookupSuccess && fvaData && (
          <div className="mt-4">
            <Alert className="mb-2 border-blue-200 bg-blue-50">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <span>Informations complètes trouvées dans le FVA</span>
                  <button 
                    onClick={() => setShowFvaDetails(!showFvaDetails)}
                    className="text-xs text-blue-700 hover:text-blue-900 underline"
                  >
                    {showFvaDetails ? "Masquer les détails" : "Voir les détails"}
                  </button>
                </div>
              </AlertDescription>
            </Alert>
            
            {showFvaDetails && (
              <Card className="mb-6 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informations du FVA</CardTitle>
                  <CardDescription>
                    Fichier des Véhicules Assurés - Données complètes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Informations du véhicule</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Immatriculation</dt>
                        <dd>{fvaData.vehicleInfo.licensePlate}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">VIN</dt>
                        <dd>{fvaData.vehicleInfo.vin}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Marque / Modèle</dt>
                        <dd>{fvaData.vehicleInfo.brand} {fvaData.vehicleInfo.model}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Première immatriculation</dt>
                        <dd>{formatDateFr(fvaData.vehicleInfo.firstRegistration)}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Informations d'assurance</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Compagnie</dt>
                        <dd>{fvaData.insuranceInfo.company}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Numéro de police</dt>
                        <dd>{fvaData.insuranceInfo.policyNumber}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Contrat</dt>
                        <dd>{fvaData.insuranceInfo.contractName}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Validité</dt>
                        <dd>Du {formatDateFr(fvaData.insuranceInfo.validFrom)} au {formatDateFr(fvaData.insuranceInfo.validUntil)}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Informations de l'assuré</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="col-span-2">
                        <dt className="text-gray-500">Nom</dt>
                        <dd>{fvaData.insuranceInfo.insuredName}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-gray-500">Adresse</dt>
                        <dd>{fvaData.insuranceInfo.insuredAddress}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Téléphone</dt>
                        <dd>{fvaData.insuranceInfo.insuredPhone}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="text-gray-500">Email</dt>
                        <dd>{fvaData.insuranceInfo.insuredEmail}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Garanties</h4>
                    <div className="flex flex-wrap gap-2">
                      {fvaData.insuranceInfo.guarantees.map((guarantee, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {guarantee}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
            readOnly={lookupSuccess || fvaLookupSuccess}
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
            readOnly={lookupSuccess || fvaLookupSuccess}
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
            readOnly={lookupSuccess || fvaLookupSuccess}
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
          {(autoInsuranceFound || fvaLookupSuccess) && (
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
                readOnly={fvaLookupSuccess}
              />
              <Button 
                type="button" 
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={lookupInsurance}
                disabled={isInsuranceLoading || autoInsuranceFound || fvaLookupSuccess}
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
              {(autoInsuranceFound || fvaLookupSuccess) 
                ? "Numéro de police récupéré automatiquement" 
                : "Saisissez le numéro de police d'assurance tel qu'il apparaît sur votre carte verte"}
            </p>

            {insuranceError && !autoInsuranceFound && !fvaLookupSuccess && (
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
              readOnly={insuranceLookupSuccess || autoInsuranceFound || fvaLookupSuccess}
            />
            
            {(insuranceLookupSuccess || autoInsuranceFound || fvaLookupSuccess) && insuranceDetails && (
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
          Consultez le Fichier des Véhicules Assurés (FVA) pour récupérer automatiquement les informations complètes du véhicule, de l'assurance et de l'assuré. Les données du SIV (Système d'Immatriculation des Véhicules) peuvent également être utilisées pour compléter le formulaire.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VehicleIdentificationStep;
