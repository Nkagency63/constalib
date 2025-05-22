
import { createContext } from 'react';
import { FormData } from '@/components/accident/types';

interface FormContextType {
  formData: FormData;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);
