
import LocationMap from './LocationMap';
import { FormData } from './types';

interface SchemeStepProps {
  formData: FormData;
}

const SchemeStep = ({ formData }: SchemeStepProps) => {
  const { geolocation } = formData;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Visualisez l'emplacement de l'accident sur la carte.
        </p>
      </div>
      
      <LocationMap 
        lat={geolocation?.lat || null} 
        lng={geolocation?.lng || null} 
        address={geolocation?.address || ""}
      />
    </div>
  );
};

export default SchemeStep;
