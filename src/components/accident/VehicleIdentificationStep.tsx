
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VehicleData, InsuranceData, FvaData } from './types/vehicleTypes';
import LicensePlateInput from './vehicle/LicensePlateInput';
import VehicleDetailsAlerts from './vehicle/VehicleDetailsAlerts';
import VehicleInfoFields from './vehicle/VehicleInfoFields';
import InsuranceInfoFields from './vehicle/InsuranceInfoFields';
import FvaDetailsCard from './vehicle/FvaDetailsCard';

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
  
  const [isFvaLoading, setIsFvaLoading] = useState(false);
  const [fvaData, setFvaData] = useState<FvaData | null>(null);
  const [fvaLookupSuccess, setFvaLookupSuccess] = useState(false);
  const [fvaError, setFvaError] = useState<string | null>(null);
  const [showFvaDetails, setShowFvaDetails] = useState(false);
  
  const [isFniLoading, setIsFniLoading] = useState(false);
  const [fniLookupSuccess, setFniLookupSuccess] = useState(false);
  const [fniError, setFniError] = useState<string | null>(null);
  
  const [searchTab, setSearchTab] = useState<'siv' | 'fni'>('siv');

  const lookupFni = async () => {
    if (!licensePlate || licensePlate.length < 5) {
      toast.error("Veuillez saisir une immatriculation valide");
      setFniError("L'immatriculation doit contenir au moins 5 caractères");
      return;
    }

    setIsFniLoading(true);
    setFniError(null);
    setFniLookupSuccess(false);
    setLookupSuccess(false);
    setSearchError(null);
    setAutoInsuranceFound(false);
    
    try {
      console.log(`Tentative de recherche du véhicule dans le FNI: ${licensePlate}`);
      const { data, error } = await supabase.functions.invoke('lookup-fni', {
        body: { licensePlate }
      });

      if (error) {
        console.error('Error looking up vehicle in FNI:', error);
        toast.error("Erreur lors de la consultation du FNI");
        setFniError("Une erreur technique est survenue lors de la consultation du FNI");
        return;
      }

      if (data.success && data.data) {
        console.log('Véhicule trouvé dans le FNI:', data.data);
        setVehicleInfo(data.data);
        setVehicleDetails(data.data);
        setLookupSuccess(true);
        setFniLookupSuccess(true);
        toast.success(data.message || "Informations du véhicule récupérées avec succès du FNI");
        
        if (data.data.insurance) {
          setAutoInsuranceFound(true);
          setInsuranceDetails({
            company: data.data.insurance.company,
            name: data.data.insurance.name
          });
          
          const policyEvent = {
            target: {
              name: 'insurancePolicy',
              value: data.data.insurance.policy
            }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(policyEvent);
          
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
          toast.success("Informations d'assurance récupérées automatiquement du FNI");
        }
      } else {
        console.log('Véhicule non trouvé dans le FNI:', data);
        setFniError(data.message || "Aucun véhicule trouvé avec cette immatriculation dans le FNI");
        toast.error(data.message || "Aucun véhicule trouvé avec cette immatriculation dans le FNI");
      }
    } catch (err) {
      console.error('Error in FNI lookup:', err);
      setFniError("Une erreur est survenue lors de la consultation du FNI");
      toast.error("Une erreur est survenue lors de la consultation du FNI");
    } finally {
      setIsFniLoading(false);
    }
  };

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
        
        if (data.data.insurance) {
          setAutoInsuranceFound(true);
          setInsuranceDetails({
            company: data.data.insurance.company,
            name: data.data.insurance.name
          });
          
          const policyEvent = {
            target: {
              name: 'insurancePolicy',
              value: data.data.insurance.policy
            }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(policyEvent);
          
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

  const lookupFva = async () => {
    if (!licensePlate || licensePlate.length < 5) {
      toast.error("Veuillez saisir une immatriculation valide");
      setFvaError("L'immatriculation doit contenir au moins 5 caractères");
      return;
    }
    
    setIsFvaLoading(true);
    setFvaError(null);
    setFvaLookupSuccess(false);
    
    try {
      console.log(`Tentative de recherche du véhicule dans le FVA: ${licensePlate}`);
      const { data, error } = await supabase.functions.invoke('lookup-fva', {
        body: { licensePlate }
      });

      if (error) {
        console.error('Error looking up vehicle in FVA:', error);
        toast.error("Erreur lors de la consultation du FVA");
        setFvaError("Une erreur technique est survenue lors de la consultation du FVA");
        return;
      }

      if (data.success && data.data) {
        console.log('Véhicule trouvé dans le FVA:', data.data);
        
        setVehicleInfo({
          brand: data.data.vehicleInfo.brand,
          model: data.data.vehicleInfo.model,
          year: data.data.vehicleInfo.firstRegistration.substring(0, 4),
          firstRegistration: data.data.vehicleInfo.firstRegistration
        });
        
        const brandEvent = {
          target: {
            name: 'vehicleBrand',
            value: data.data.vehicleInfo.brand
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(brandEvent);
        
        const modelEvent = {
          target: {
            name: 'vehicleModel',
            value: data.data.vehicleInfo.model
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(modelEvent);
        
        const yearEvent = {
          target: {
            name: 'vehicleYear',
            value: data.data.vehicleInfo.firstRegistration.substring(0, 4)
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(yearEvent);
        
        if (setInsuranceInfo) {
          setInsuranceInfo({ company: data.data.insuranceInfo.company });
        }
        
        const policyEvent = {
          target: {
            name: 'insurancePolicy',
            value: data.data.insuranceInfo.policyNumber
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(policyEvent);
        
        const companyEvent = {
          target: {
            name: 'insuranceCompany',
            value: data.data.insuranceInfo.company
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(companyEvent);
        
        setFvaData(data.data);
        setFvaLookupSuccess(true);
        setShowFvaDetails(true);
        setInsuranceLookupSuccess(true);
        setAutoInsuranceFound(true);
        
        toast.success(data.message || "Informations complètes récupérées du FVA avec succès");
      } else {
        console.log('Véhicule non trouvé dans le FVA:', data);
        setFvaError(data.message || "Aucun véhicule trouvé avec cette immatriculation dans le FVA");
        toast.error(data.message || "Aucun véhicule trouvé avec cette immatriculation dans le FVA");
      }
    } catch (err) {
      console.error('Error in FVA lookup:', err);
      setFvaError("Une erreur est survenue lors de la consultation du FVA");
      toast.error("Une erreur est survenue lors de la consultation du FVA");
    } finally {
      setIsFvaLoading(false);
    }
  };

  const handleSearchTabChange = (tab: 'siv' | 'fni') => {
    setSearchTab(tab);
    
    setLookupSuccess(false);
    setSearchError(null);
    setFniLookupSuccess(false);
    setFniError(null);
  };

  return (
    <div className="space-y-6">
      {/* License Plate Input */}
      <LicensePlateInput
        licensePlate={licensePlate}
        handleInputChange={handleInputChange}
        onSearchTab={handleSearchTabChange}
        searchTab={searchTab}
        onLookupVehicle={lookupVehicle}
        onLookupFni={lookupFni}
        onLookupFva={lookupFva}
        isLoading={isLoading}
        isFvaLoading={isFvaLoading}
        isFniLoading={isFniLoading}
        lookupSuccess={lookupSuccess}
        fniLookupSuccess={fniLookupSuccess}
        searchError={searchError}
        fniError={fniError}
        fvaError={fvaError}
      />
      
      {/* Vehicle Details Alerts */}
      <VehicleDetailsAlerts
        lookupSuccess={lookupSuccess}
        fniLookupSuccess={fniLookupSuccess}
        vehicleDetails={vehicleDetails}
      />
      
      {/* FVA Details Card */}
      {showFvaDetails && fvaData && <FvaDetailsCard fvaData={fvaData} />}
      
      {/* Vehicle Info Fields */}
      <VehicleInfoFields
        vehicleBrand={vehicleBrand}
        vehicleModel={vehicleModel}
        vehicleYear={vehicleYear}
        vehicleDescription={vehicleDescription}
        handleInputChange={handleInputChange}
        readOnly={lookupSuccess || fvaLookupSuccess}
      />
      
      {/* Insurance Info Fields */}
      <InsuranceInfoFields
        insurancePolicy={insurancePolicy}
        insuranceCompany={insuranceCompany}
        handleInputChange={handleInputChange}
        insuranceLookupSuccess={insuranceLookupSuccess}
        insuranceDetails={insuranceDetails}
        autoInsuranceFound={autoInsuranceFound}
        setInsuranceLookupSuccess={setInsuranceLookupSuccess}
        setInsuranceDetails={setInsuranceDetails}
        setInsuranceInfo={setInsuranceInfo}
      />
    </div>
  );
};

export default VehicleIdentificationStep;
