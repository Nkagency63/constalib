
import { createContext } from 'react';
import { FormData } from '@/components/accident/types';

interface FormContextType {
  formData: FormData;
  currentVehicleId?: string;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);
