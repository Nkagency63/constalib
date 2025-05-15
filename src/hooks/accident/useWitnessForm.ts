
import { useState } from 'react';
import { WitnessInfo } from '@/components/accident/types';

export const useWitnessForm = (initialData?: any) => {
  const [hasWitnesses, setHasWitnesses] = useState<boolean>(initialData?.hasWitnesses || false);
  const [witnesses, setWitnesses] = useState<WitnessInfo[]>(initialData?.witnesses || []);

  const updateWitness = (index: number, field: keyof WitnessInfo, value: string) => {
    setWitnesses(prev => prev.map((witness, i) => 
      i === index ? { ...witness, [field]: value } : witness
    ));
  };

  const addWitness = () => {
    setWitnesses(prev => [...prev, { fullName: '', phone: '', email: '' }]);
  };

  const removeWitness = (index: number) => {
    setWitnesses(prev => prev.filter((_, i) => i !== index));
  };

  return {
    hasWitnesses,
    witnesses,
    setHasWitnesses,
    updateWitness,
    addWitness,
    removeWitness,
    getWitnessData: () => ({
      hasWitnesses,
      witnesses
    })
  };
};
