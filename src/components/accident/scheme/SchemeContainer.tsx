
import React from 'react';
import { SchemeData, GeolocationData } from '../types';
import VehicleSchemeWrapper from './components/VehicleSchemeWrapper';
import SchemeContentWrapper from './components/SchemeContentWrapper';

interface SchemeContainerProps {
  initialData?: SchemeData;
  formData?: any;
  onUpdateSchemeData?: (data: SchemeData) => void;
  onSchemeUpdate?: (data: SchemeData) => void;
  readOnly?: boolean;
  activeTab?: string;
}

const SchemeContainer: React.FC<SchemeContainerProps> = ({
  initialData,
  formData,
  onUpdateSchemeData,
  onSchemeUpdate,
  readOnly = false,
  activeTab = 'scheme'
}) => {
  // Extract geolocation data from formData if available
  const geolocationData: GeolocationData | undefined = formData?.geolocation ? {
    lat: formData.geolocation.lat,
    lng: formData.geolocation.lng,
    address: formData.geolocation.address,
    accuracy: formData.geolocation.accuracy,
    timestamp: formData.geolocation.timestamp
  } : undefined;

  // Render the appropriate content based on the active tab
  return (
    <>
      {activeTab === 'scheme' ? (
        <VehicleSchemeWrapper
          initialData={initialData}
          onUpdateSchemeData={onUpdateSchemeData}
        />
      ) : (
        <SchemeContentWrapper
          initialData={initialData}
          formData={formData}
          onUpdateSchemeData={onUpdateSchemeData}
          onSchemeUpdate={onSchemeUpdate}
          readOnly={readOnly}
          geolocationData={geolocationData}
        />
      )}
    </>
  );
};

export default SchemeContainer;
