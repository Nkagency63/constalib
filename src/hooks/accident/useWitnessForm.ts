
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WitnessInfo } from '@/components/accident/types';

export const useWitnessForm = () => {
  const [hasWitnesses, setHasWitnesses] = useState(false);
  const [witnesses, setWitnesses] = useState<WitnessInfo[]>([]);

  const addWitness = () => {
    setWitnesses(prev => [
      ...prev,
      {
        id: uuidv4(),
        name: '',
        address: '',
        phone: '',
        email: '',
        fullName: '' // Include both name and fullName for compatibility
      }
    ]);
  };

  const updateWitness = (id: string, field: keyof WitnessInfo, value: string) => {
    setWitnesses(prev =>
      prev.map(witness =>
        witness.id === id ? { ...witness, [field]: value } : witness
      )
    );
  };

  const removeWitness = (id: string) => {
    setWitnesses(prev => prev.filter(witness => witness.id !== id));
  };

  return {
    hasWitnesses,
    setHasWitnesses,
    witnesses,
    setWitnesses,
    addWitness,
    updateWitness,
    removeWitness
  };
};
