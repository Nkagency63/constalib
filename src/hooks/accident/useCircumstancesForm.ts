
import { useState } from 'react';
import { DEFAULT_CIRCUMSTANCES } from '@/components/accident/defaultCircumstances';
import { Circumstance } from '@/components/accident/types';

export const useCircumstancesForm = (initialData?: any) => {
  const [vehicleACircumstances, setVehicleACircumstances] = useState<Circumstance[]>(
    initialData?.vehicleACircumstances || [...DEFAULT_CIRCUMSTANCES]
  );
  const [vehicleBCircumstances, setVehicleBCircumstances] = useState<Circumstance[]>(
    initialData?.vehicleBCircumstances || [...DEFAULT_CIRCUMSTANCES]
  );

  const handleCircumstanceChange = (vehicleId: 'A' | 'B', circumstanceId: string, isChecked: boolean) => {
    const setCircumstances = vehicleId === 'A' ? setVehicleACircumstances : setVehicleBCircumstances;
    
    setCircumstances(prevCircumstances => 
      prevCircumstances.map(item => 
        item.id === circumstanceId ? { ...item, selected: isChecked } : item
      )
    );
  };

  return {
    vehicleACircumstances,
    vehicleBCircumstances,
    handleCircumstanceChange,
    getCircumstancesData: () => ({
      vehicleACircumstances,
      vehicleBCircumstances
    })
  };
};
