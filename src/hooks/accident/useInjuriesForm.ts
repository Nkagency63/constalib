
import { useState } from 'react';

export const useInjuriesForm = (initialData?: any) => {
  const [hasInjuries, setHasInjuries] = useState<boolean>(initialData?.hasInjuries || false);
  const [injuriesDescription, setInjuriesDescription] = useState<string>(initialData?.injuriesDescription || '');

  const updateHasInjuries = (value: boolean) => {
    setHasInjuries(value);
    if (!value) {
      setInjuriesDescription('');
    }
  };

  return {
    hasInjuries,
    injuriesDescription,
    setHasInjuries: updateHasInjuries,
    setInjuriesDescription,
    getInjuriesData: () => ({
      hasInjuries,
      injuriesDescription
    })
  };
};
