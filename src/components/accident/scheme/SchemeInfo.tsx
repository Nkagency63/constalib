
import React from 'react';
import { MapPin } from 'lucide-react';

interface SchemeInfoProps {
  vehicleCount: number;
  pathCount: number;
  annotationCount: number;
  isEmpty: boolean;
  geolocationAddress?: string;
}

const SchemeInfo: React.FC<SchemeInfoProps> = ({ 
  vehicleCount, 
  pathCount, 
  annotationCount, 
  isEmpty,
  geolocationAddress 
}) => {
  if (isEmpty && !geolocationAddress) return null;

  return (
    <div className="absolute bottom-2 left-2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-md text-xs font-medium text-gray-700">
      {geolocationAddress && (
        <div className="flex items-center mb-1">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate max-w-[200px]">{geolocationAddress}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        {vehicleCount > 0 && (
          <span>{vehicleCount} véhicule{vehicleCount > 1 ? 's' : ''}</span>
        )}
        {pathCount > 0 && (
          <span>{pathCount} trajectoire{pathCount > 1 ? 's' : ''}</span>
        )}
        {annotationCount > 0 && (
          <span>{annotationCount} note{annotationCount > 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
};

export default SchemeInfo;
