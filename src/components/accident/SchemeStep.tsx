
import React from 'react';
import { FormData, SchemeData } from './types';
import SchemeContainer from './scheme/SchemeContainer';
import { useToast } from '@/hooks/use-toast';

interface SchemeStepProps {
  formData: FormData;
  handleSchemeData?: (data: SchemeData) => void;
}

const SchemeStep: React.FC<SchemeStepProps> = ({ formData }) => {
  const { toast } = useToast();
  
  const handleSchemeUpdate = (schemeData: SchemeData) => {
    console.log('Scheme data saved:', schemeData);
    // If a handler was provided, call it with the updated scheme data
    // This is optional since we're not requiring it in the props
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <SchemeContainer
          formData={formData}
          onUpdateSchemeData={handleSchemeUpdate}
        />
      </div>
    </div>
  );
};

export default SchemeStep;
