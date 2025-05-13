import React from 'react';
import { FormData } from '../types';

interface DescriptionCardProps {
  formData: FormData;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ formData }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-medium mb-4">Description de l'accident</h3>
      
      <div className="space-y-3">
        <div>
          <span className="font-medium">Date:</span> {formData.date}
        </div>
        <div>
          <span className="font-medium">Heure:</span> {formData.time}
        </div>
        <div>
          <span className="font-medium">Lieu:</span> {formData.location}
        </div>
        
        {formData.hasInjuries && (
          <div>
            <span className="font-medium">Blessés:</span> Oui
            {formData.injuriesDescription && (
              <div>
                <span className="font-medium">Description des blessures:</span> {formData.injuriesDescription}
              </div>
            )}
          </div>
        )}
        
        {formData.hasMaterialDamage && (
          <div>
            <span className="font-medium">Dégâts matériels:</span> Oui
            {formData.materialDamageDescription && (
              <div>
                <span className="font-medium">Description des dégâts:</span> {formData.materialDamageDescription}
              </div>
            )}
          </div>
        )}

        {formData.witnesses?.map((witness, index) => (
          <div key={index} className="mb-2">
            <span className="font-medium">Témoin {index + 1}:</span> {witness.name}
            {witness.phone && <>, Tél: {witness.phone}</>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DescriptionCard;
