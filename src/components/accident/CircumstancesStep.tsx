import React from 'react';
import { FormData, Circumstance } from './types';

interface CircumstancesStepProps {
  formData: FormData;
  handleCircumstanceChange: (vehicleId: string, circumstance: Circumstance) => void;
  currentVehicleId: string;
}

const circumstancesOptions: Circumstance[] = [
  { id: '1', text: 'En stationnement', label: 'En stationnement', image: '/images/circumstances/parking.png' },
  { id: '2', text: 'Quittait un stationnement', label: 'Quittait un stationnement', image: '/images/circumstances/leaving-parking.png' },
  { id: '3', text: 'Prenait un stationnement', label: 'Prenait un stationnement', image: '/images/circumstances/taking-parking.png' },
  { id: '4', text: 'Sortait d\'un parking, d\'un lieu privé, d\'un chemin de terre', label: 'Sortait d\'un parking', image: '/images/circumstances/exiting-parking.png' },
  { id: '5', text: 'S\'engageait sur un rond-point', label: 'S\'engageait sur un rond-point', image: '/images/circumstances/entering-roundabout.png' },
  { id: '6', text: 'Circulait sur un rond-point', label: 'Circulait sur un rond-point', image: '/images/circumstances/circulating-roundabout.png' },
  { id: '7', text: 'N\'avait pas observé un signal de priorité', label: 'N\'avait pas observé un signal de priorité', image: '/images/circumstances/priority-signal.png' },
  { id: '8', text: 'N\'avait pas respecté un feu rouge', label: 'N\'avait pas respecté un feu rouge', image: '/images/circumstances/red-light.png' },
  { id: '9', text: 'Venait de droite', label: 'Venait de droite', image: '/images/circumstances/coming-from-right.png' },
  { id: '10', text: 'Reculait', label: 'Reculait', image: '/images/circumstances/reversing.png' },
  { id: '11', text: 'Changeait de file', label: 'Changeait de file', image: '/images/circumstances/changing-lanes.png' },
  { id: '12', text: 'Dépassait', label: 'Dépassait', image: '/images/circumstances/overtaking.png' },
  { id: '13', text: 'Virait à droite', label: 'Virait à droite', image: '/images/circumstances/turning-right.png' },
  { id: '14', text: 'Virait à gauche', label: 'Virait à gauche', image: '/images/circumstances/turning-left.png' },
  { id: '15', text: 'Freinait', label: 'Freinait', image: '/images/circumstances/braking.png' },
  { id: '16', text: 'Heurtait à l\'arrière en circulant dans le même sens', label: 'Heurtait à l\'arrière', image: '/images/circumstances/rear-end-collision.png' },
  { id: '17', text: 'Empiétait sur une voie réservée à la circulation en sens inverse', label: 'Empiétait voie inverse', image: '/images/circumstances/encroaching-opposite-lane.png' },
  { id: '18', text: 'N\'avait pas conservé la maîtrise de son véhicule', label: 'Perte de contrôle', image: '/images/circumstances/loss-of-control.png' },
  { id: '19', text: 'Effectuait un dépassement par la droite', label: 'Dépassement par la droite', image: '/images/circumstances/overtaking-right.png' }
];

const CircumstancesStep: React.FC<CircumstancesStepProps> = ({ formData, handleCircumstanceChange, currentVehicleId }) => {
  const vehicleCircumstances = currentVehicleId === 'A' ? formData.vehicleACircumstances : formData.vehicleBCircumstances;

  const isCircumstanceSelected = (circumstance: Circumstance) => {
    return vehicleCircumstances?.some(item => item.id === circumstance.id) || false;
  };

  const handleCircumstanceClick = (circumstance: Circumstance) => {
    handleCircumstanceChange(currentVehicleId, circumstance);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">
        Circonstances du véhicule {currentVehicleId}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {circumstancesOptions.map((item) => (
          <div 
            key={item.id}
            className={`flex flex-col items-center space-y-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${isCircumstanceSelected(item) ? 'bg-gray-100 border-blue-500' : 'border-gray-200'}`}
            onClick={() => handleCircumstanceClick(item)}
          >
            {item.image && (
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.text} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <p className="text-center text-sm font-medium">{item.text || item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircumstancesStep;
