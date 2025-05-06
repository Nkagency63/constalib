
import React from 'react';
import { FormData } from './types';
import SchemeContainer from './scheme/SchemeContainer';

interface SchemeStepProps {
  formData: FormData;
}

const SchemeStep: React.FC<SchemeStepProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <SchemeContainer />
      </div>
    </div>
  );
};

export default SchemeStep;
