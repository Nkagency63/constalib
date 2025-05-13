
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WitnessInfo } from '@/components/accident/types';

export const useWitnessForm = () => {
  const [hasWitnesses, setHasWitnesses] = useState(false);
  const [witnesses, setWitnesses] = useState<WitnessInfo[]>([]);

  const addWitness = () => {
    const newWitness: WitnessInfo = {
      id: uuidv4(),
      name: '',
      address: '',
      phone: '',
      email: ''
    };
    setWitnesses(prev => [...prev, newWitness]);
  };

  const updateWitness = (id: string, field: keyof WitnessInfo, value: string) => {
    setWitnesses(prev => 
      prev.map(witness => 
        witness.id === id 
          ? { ...witness, [field]: value } 
          : witness
      )
    );
  };

  const removeWitness = (id: string) => {
    setWitnesses(prev => prev.filter(witness => witness.id !== id));
  };

  const getWitnessData = () => {
    return {
      hasWitnesses,
      witnesses
    };
  };

  return {
    hasWitnesses,
    witnesses,
    setHasWitnesses,
    addWitness,
    updateWitness,
    removeWitness,
    getWitnessData
  };
};
