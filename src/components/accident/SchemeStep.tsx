
import VehicleScheme from '../VehicleScheme';

const SchemeStep = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Schéma de l'accident</h3>
        <p className="text-sm text-constalib-dark-gray">
          Positionnez les véhicules pour représenter visuellement l'accident.
        </p>
      </div>
      
      <VehicleScheme />
    </div>
  );
};

export default SchemeStep;
