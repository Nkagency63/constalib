
import { useState } from 'react';
import { DriverInfo, InsuredInfo } from '@/components/accident/types';

const defaultDriverInfo: DriverInfo = {
  fullName: '',
  address: '',
  licenseNumber: '',
  licenseDate: '',
  phone: '',
  email: ''
};

const defaultInsuredInfo: InsuredInfo = {
  fullName: '',
  address: '',
  phone: '',
  email: '',
  policyNumber: '',
  isDriver: true
};

export const useDriversInsuredForm = (initialData?: any) => {
  // Driver A info
  const [driverA, setDriverA] = useState<DriverInfo>(initialData?.driverA || { ...defaultDriverInfo });
  
  // Driver B info
  const [driverB, setDriverB] = useState<DriverInfo>(initialData?.driverB || { ...defaultDriverInfo });
  
  // Insured A info
  const [insuredA, setInsuredA] = useState<InsuredInfo>(initialData?.insuredA || { 
    ...defaultInsuredInfo,
    policyNumber: initialData?.insurancePolicy || ''
  });
  
  // Insured B info
  const [insuredB, setInsuredB] = useState<InsuredInfo>(initialData?.insuredB || { 
    ...defaultInsuredInfo,
    policyNumber: initialData?.otherVehicle?.insurancePolicy || ''
  });

  const updateDriverA = (field: keyof DriverInfo, value: string) => {
    setDriverA(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Si l'assuré est aussi le conducteur, mettre à jour certaines infos
    if (insuredA.isDriver) {
      if (field === 'fullName' || field === 'address' || field === 'phone' || field === 'email') {
        setInsuredA(prev => ({
          ...prev,
          [field]: value
        }));
      }
    }
  };

  const updateDriverB = (field: keyof DriverInfo, value: string) => {
    setDriverB(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Si l'assuré est aussi le conducteur, mettre à jour certaines infos
    if (insuredB.isDriver) {
      if (field === 'fullName' || field === 'address' || field === 'phone' || field === 'email') {
        setInsuredB(prev => ({
          ...prev,
          [field]: value
        }));
      }
    }
  };

  const updateInsuredA = (field: keyof InsuredInfo, value: string | boolean) => {
    setInsuredA(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Si l'option "l'assuré est le conducteur" est activée, synchroniser les données
    if (field === 'isDriver' && value === true) {
      setInsuredA(prev => ({
        ...prev,
        fullName: driverA.fullName,
        address: driverA.address,
        phone: driverA.phone,
        email: driverA.email
      }));
    }
  };

  const updateInsuredB = (field: keyof InsuredInfo, value: string | boolean) => {
    setInsuredB(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Si l'option "l'assuré est le conducteur" est activée, synchroniser les données
    if (field === 'isDriver' && value === true) {
      setInsuredB(prev => ({
        ...prev,
        fullName: driverB.fullName,
        address: driverB.address,
        phone: driverB.phone,
        email: driverB.email
      }));
    }
  };

  return {
    driverA,
    driverB,
    insuredA,
    insuredB,
    updateDriverA,
    updateDriverB,
    updateInsuredA,
    updateInsuredB,
    getDriversInsuredData: () => ({
      driverA,
      driverB,
      insuredA,
      insuredB
    })
  };
};
