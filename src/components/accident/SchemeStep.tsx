
import VehicleScheme from '../VehicleScheme';
import { useIsMobile } from '../../hooks/use-mobile';
import AccidentMap from './AccidentMap';
import { useFormContext } from '@/hooks/useFormContext';

const SchemeStep = () => {
  const isMobile = useIsMobile();
  const { formData } = useFormContext();
  const { lat, lng, address } = formData.geolocation;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Positionnez les véhicules pour représenter visuellement l'accident.
        </p>
        {isMobile && (
          <p className="text-xs text-amber-600 mt-1">
            Tournez votre appareil en mode paysage pour une meilleure expérience.
          </p>
        )}
      </div>

      {lat && lng ? (
        <div className="mb-6">
          <h4 className="text-md font-medium text-constalib-dark mb-2">Localisation de l'accident</h4>
          <AccidentMap lat={lat} lng={lng} address={address} />
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            La localisation de l'accident n'a pas été renseignée. Vous pouvez retourner à l'étape "Localisation" pour définir l'emplacement exact.
          </p>
        </div>
      )}
      
      <VehicleScheme />
    </div>
  );
};

export default SchemeStep;

