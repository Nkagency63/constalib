
import { useState } from 'react';

export const useCircumstancesForm = (initialData?: any) => {
  const [vehicleACircumstances, setVehicleACircumstances] = useState<string[]>(
    initialData?.vehicleACircumstances || []
  );
  const [vehicleBCircumstances, setVehicleBCircumstances] = useState<string[]>(
    initialData?.vehicleBCircumstances || []
  );

  const handleCircumstanceChange = (vehicleId: 'A' | 'B', circumstanceId: string, isChecked: boolean) => {
    const field = vehicleId === 'A' ? vehicleACircumstances : vehicleBCircumstances;
    const setField = vehicleId === 'A' ? setVehicleACircumstances : setVehicleBCircumstances;
    
    if (isChecked) {
      if (!field.includes(circumstanceId)) {
        setField([...field, circumstanceId]);
      }
    } else {
      setField(field.filter(id => id !== circumstanceId));
    }
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
