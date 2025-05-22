
import { useState } from 'react';

export const useEmergencyForm = (initialData?: any) => {
  const [emergencyContacted, setEmergencyContacted] = useState<boolean>(initialData?.emergencyContacted || false);

  const handleEmergencyContacted = () => {
    setEmergencyContacted(true);
  };

  return {
    emergencyContacted,
    onEmergencyContacted: handleEmergencyContacted,
    getEmergencyData: () => ({
      emergencyContacted
    })
  };
};
