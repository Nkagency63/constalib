
import { useState } from 'react';

export const useVehicleForm = (initialData?: any) => {
  const [currentVehicleId, setCurrentVehicleId] = useState<'A' | 'B'>('A');
  const [licensePlate, setLicensePlate] = useState(initialData?.licensePlate || '');
  const [vehicleBrand, setVehicleBrand] = useState(initialData?.vehicleBrand || '');
  const [vehicleModel, setVehicleModel] = useState(initialData?.vehicleModel || '');
  const [vehicleYear, setVehicleYear] = useState(initialData?.vehicleYear || '');
  const [vehicleDescription, setVehicleDescription] = useState(initialData?.vehicleDescription || '');
  const [insurancePolicy, setInsurancePolicy] = useState(initialData?.insurancePolicy || '');
  const [insuranceCompany, setInsuranceCompany] = useState(initialData?.insuranceCompany || '');
  const [otherVehicle, setOtherVehicle] = useState(initialData?.otherVehicle || {
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    description: '',
    insurancePolicy: '',
    insuranceCompany: ''
  });
  
  // Ajout des informations du conducteur et de l'assuré pour le véhicule A
  const [driver, setDriver] = useState(initialData?.driver || {
    name: '',
    address: '',
    phone: '',
    licenseNumber: ''
  });
  
  const [insured, setInsured] = useState(initialData?.insured || {
    name: '',
    address: '',
    phone: ''
  });
  
  // Ajout des informations du conducteur et de l'assuré pour le véhicule B
  const [otherDriver, setOtherDriver] = useState(initialData?.otherDriver || {
    name: '',
    address: '',
    phone: '',
    licenseNumber: ''
  });
  
  const [otherInsured, setOtherInsured] = useState(initialData?.otherInsured || {
    name: '',
    address: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    switch(name) {
      case 'licensePlate':
        setLicensePlate(value);
        break;
      case 'vehicleBrand':
        setVehicleBrand(value);
        break;
      case 'vehicleModel':
        setVehicleModel(value);
        break;
      case 'vehicleYear':
        setVehicleYear(value);
        break;
      case 'vehicleDescription':
        setVehicleDescription(value);
        break;
      case 'insurancePolicy':
        setInsurancePolicy(value);
        break;
      case 'insuranceCompany':
        setInsuranceCompany(value);
        break;
      // Gestion des champs pour le conducteur du véhicule A
      case 'driverName':
        setDriver(prev => ({ ...prev, name: value }));
        break;
      case 'driverAddress':
        setDriver(prev => ({ ...prev, address: value }));
        break;
      case 'driverPhone':
        setDriver(prev => ({ ...prev, phone: value }));
        break;
      case 'driverLicense':
        setDriver(prev => ({ ...prev, licenseNumber: value }));
        break;
      
      // Gestion des champs pour l'assuré du véhicule A
      case 'insuredName':
        setInsured(prev => ({ ...prev, name: value }));
        break;
      case 'insuredAddress':
        setInsured(prev => ({ ...prev, address: value }));
        break;
      case 'insuredPhone':
        setInsured(prev => ({ ...prev, phone: value }));
        break;
      
      // Gestion des champs pour le conducteur du véhicule B
      case 'otherDriverName':
        setOtherDriver(prev => ({ ...prev, name: value }));
        break;
      case 'otherDriverAddress':
        setOtherDriver(prev => ({ ...prev, address: value }));
        break;
      case 'otherDriverPhone':
        setOtherDriver(prev => ({ ...prev, phone: value }));
        break;
      case 'otherDriverLicense':
        setOtherDriver(prev => ({ ...prev, licenseNumber: value }));
        break;
      
      // Gestion des champs pour l'assuré du véhicule B
      case 'otherInsuredName':
        setOtherInsured(prev => ({ ...prev, name: value }));
        break;
      case 'otherInsuredAddress':
        setOtherInsured(prev => ({ ...prev, address: value }));
        break;
      case 'otherInsuredPhone':
        setOtherInsured(prev => ({ ...prev, phone: value }));
        break;
      default:
        // Pour les autres champs qui ne correspondent pas aux cas spécifiques
        console.log(`Unhandled input field in useVehicleForm: ${name}`);
        break;
    }
  };

  const handleOtherVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'licensePlate') {
      setOtherVehicle(prev => ({
        ...prev,
        licensePlate: value
      }));
      return;
    }
    
    if (name === 'otherVehicleInsurancePolicy') {
      setOtherVehicle(prev => ({
        ...prev,
        insurancePolicy: value
      }));
      return;
    }
    
    if (name === 'otherVehicleInsuranceCompany') {
      setOtherVehicle(prev => ({
        ...prev,
        insuranceCompany: value
      }));
      return;
    }
    
    setOtherVehicle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setVehicleInfo = (data: {brand: string, model: string, year: string, firstRegistration?: string}) => {
    setVehicleBrand(data.brand);
    setVehicleModel(data.model);
    setVehicleYear(data.year);
  };

  const setOtherVehicleInfo = (data: {brand: string, model: string, year: string, firstRegistration?: string}) => {
    setOtherVehicle(prev => ({
      ...prev,
      brand: data.brand,
      model: data.model,
      year: data.year,
      firstRegistration: data.firstRegistration
    }));
  };

  const updateCurrentVehicleId = (vehicleId: 'A' | 'B') => {
    setCurrentVehicleId(vehicleId);
  };
  
  // Fonction pour copier les informations du conducteur vers l'assuré
  const copyDriverToInsured = () => {
    setInsured({
      name: driver.name,
      address: driver.address,
      phone: driver.phone
    });
  };
  
  // Fonction pour copier les informations du conducteur B vers l'assuré B
  const copyOtherDriverToInsured = () => {
    setOtherInsured({
      name: otherDriver.name,
      address: otherDriver.address,
      phone: otherDriver.phone
    });
  };

  return {
    currentVehicleId,
    licensePlate,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    vehicleDescription,
    insurancePolicy,
    insuranceCompany,
    otherVehicle,
    driver,
    insured,
    otherDriver,
    otherInsured,
    handleInputChange,
    handleOtherVehicleChange,
    setVehicleInfo,
    setOtherVehicleInfo,
    updateCurrentVehicleId,
    copyDriverToInsured,
    copyOtherDriverToInsured,
    getVehicleData: () => ({
      licensePlate,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleDescription,
      insurancePolicy,
      insuranceCompany,
      otherVehicle,
      currentVehicleId,
      driver,
      insured,
      otherDriver,
      otherInsured
    })
  };
};
