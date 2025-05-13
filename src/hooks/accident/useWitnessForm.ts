
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WitnessInfo } from '@/components/accident/types';

export const useWitnessForm = () => {
  const [hasWitnesses, setHasWitnesses] = useState<boolean>(false);
  const [witnesses, setWitnesses] = useState<WitnessInfo[]>([]);

  const addWitness = () => {
    const newWitness: WitnessInfo = {
      id: uuidv4(),
      fullName: '',
      phone: '',
      email: '',
      address: '',
      statement: ''
    };

    setWitnesses([...witnesses, newWitness]);
  };

  const updateWitness = (id: string, field: keyof WitnessInfo, value: string) => {
    setWitnesses(witnesses.map(witness => 
      witness.id === id ? { ...witness, [field]: value } : witness
    ));
  };

  const removeWitness = (id: string) => {
    setWitnesses(witnesses.filter(witness => witness.id !== id));
  };

  const getWitnessData = () => {
    return {
      hasWitnesses,
      witnesses
    };
  };

  return {
    hasWitnesses,
    setHasWitnesses,
    witnesses,
    setWitnesses,
    addWitness,
    updateWitness,
    removeWitness,
    getWitnessData
  };
};
