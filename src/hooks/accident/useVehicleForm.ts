
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
    handleInputChange,
    handleOtherVehicleChange,
    setVehicleInfo,
    setOtherVehicleInfo,
    updateCurrentVehicleId,
    getVehicleData: () => ({
      licensePlate,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleDescription,
      insurancePolicy,
      insuranceCompany,
      otherVehicle,
      currentVehicleId
    })
  };
};
