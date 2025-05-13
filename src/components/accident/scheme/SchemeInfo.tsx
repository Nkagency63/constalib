
import React from 'react';

interface SchemeInfoProps {
  vehicleCount: number;
  pathCount: number;
  annotationCount: number;
  isEmpty: boolean;
}

const SchemeInfo: React.FC<SchemeInfoProps> = ({ vehicleCount, pathCount, annotationCount, isEmpty }) => {
  if (isEmpty) return null;
  
  return (
    <div className="absolute bottom-2 left-2 bg-white/80 p-2 rounded text-xs text-constalib-dark-gray">
      <p>
        <span className="font-medium">{vehicleCount}</span> véhicule(s) · 
        <span className="font-medium"> {pathCount}</span> trajectoire(s) · 
        <span className="font-medium"> {annotationCount}</span> annotation(s)
      </p>
    </div>
  );
};

export default SchemeInfo;
