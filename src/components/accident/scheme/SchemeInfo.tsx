
import React from 'react';

interface SchemeInfoProps {
  vehicleCount: number;
  pathCount: number;
  annotationCount: number;
  isEmpty: boolean;
}

const SchemeInfo = ({ vehicleCount, pathCount, annotationCount, isEmpty }: SchemeInfoProps) => {
  return (
    <div className="bg-white p-2 text-xs text-gray-500 border-t">
      {isEmpty ? (
        <p>Cliquez sur la carte pour ajouter des véhicules, trajectoires, et annotations</p>
      ) : (
        <p>
          {vehicleCount} véhicule{vehicleCount > 1 ? 's' : ''} • 
          {pathCount} trajectoire{pathCount > 1 ? 's' : ''} • 
          {annotationCount} annotation{annotationCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default SchemeInfo;
