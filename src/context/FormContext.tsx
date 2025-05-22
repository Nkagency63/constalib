
import { createContext } from 'react';
import { FormData } from '@/components/accident/types';

interface FormContextType {
  formData: FormData;
  updateFormData?: (data: Partial<FormData>) => void;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

