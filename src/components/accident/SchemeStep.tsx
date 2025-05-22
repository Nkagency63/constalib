
import VehicleScheme from '../vehicle-scheme/VehicleScheme';
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
          Positionnez les véhicules sur la carte pour représenter visuellement l'accident.
        </p>
      </div>
      
      <VehicleScheme geolocation={geolocation} />
    </div>
  );
};

export default SchemeStep;
