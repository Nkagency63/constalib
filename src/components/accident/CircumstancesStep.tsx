
import React from 'react';
import { Circumstance } from './types';

interface CircumstancesStepProps {
  formData: any;
  handleCircumstanceChange: (vehicleId: string, circumstanceId: string, checked: boolean) => void;
  currentVehicleId: string;
  setCurrentVehicleId?: (id: string) => void;
}

const CircumstancesStep: React.FC<CircumstancesStepProps> = ({
  formData,
  handleCircumstanceChange,
  currentVehicleId,
  setCurrentVehicleId
}) => {
  // Get circumstances from formData
  const vehicleACircumstances = formData.circumstancesA || [];
  const vehicleBCircumstances = formData.circumstancesB || [];

  // List of all possible circumstances
  const circumstances: Circumstance[] = [
    { id: "1", label: "En stationnement", code: "1" },
    { id: "2", label: "Quittait un stationnement", code: "2" },
    { id: "3", label: "Prenait un stationnement", code: "3" },
    { id: "4", label: "Sortait d'un parking, d'un lieu privé, d'un chemin de terre", code: "4" },
    { id: "5", label: "S'engageait dans un parking, un lieu privé, un chemin de terre", code: "5" },
    { id: "6", label: "S'engageait sur une place à sens giratoire", code: "6" },
    { id: "7", label: "Roulait sur une place à sens giratoire", code: "7" },
    { id: "8", label: "Heurtait à l'arrière, en roulant dans le même sens et sur une même file", code: "8" },
    { id: "9", label: "Roulait dans le même sens et sur une file différente", code: "9" },
    { id: "10", label: "Changeait de file", code: "10" },
    { id: "11", label: "Doublait", code: "11" },
    { id: "12", label: "Virait à droite", code: "12" },
    { id: "13", label: "Virait à gauche", code: "13" },
    { id: "14", label: "Reculait", code: "14" },
    { id: "15", label: "Empiétait sur une voie réservée à la circulation en sens inverse", code: "15" },
    { id: "16", label: "Venait de droite (dans un carrefour)", code: "16" },
    { id: "17", label: "N'avait pas observé un signal de priorité ou un feu rouge", code: "17" },
  ];

  // Check if a circumstance is selected for a vehicle
  const isCircumstanceSelected = (vehicleId: string, circumstanceId: string) => {
    if (vehicleId === "A") {
      return vehicleACircumstances.some((c: Circumstance) => c.id === circumstanceId && c.selected);
    } else {
      return vehicleBCircumstances.some((c: Circumstance) => c.id === circumstanceId && c.selected);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (vehicleId: string, circumstanceId: string, checked: boolean) => {
    handleCircumstanceChange(vehicleId, circumstanceId, checked);
  };

  // Switch between vehicles
  const switchVehicle = (vehicleId: string) => {
    if (setCurrentVehicleId) {
      setCurrentVehicleId(vehicleId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              currentVehicleId === "A"
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => switchVehicle("A")}
          >
            Véhicule A
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
              currentVehicleId === "B"
                ? "bg-red-700 text-white border-red-700"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => switchVehicle("B")}
          >
            Véhicule B
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium mb-2">
          Sélectionnez les circonstances pour le véhicule {currentVehicleId}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Cochez toutes les cases qui s'appliquent à votre situation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {circumstances.map((circumstance) => (
          <div
            key={circumstance.id}
            className="flex items-start p-3 border rounded-lg hover:bg-gray-50"
          >
            <input
              type="checkbox"
              id={`circumstance-${currentVehicleId}-${circumstance.id}`}
              className="w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              checked={isCircumstanceSelected(currentVehicleId, circumstance.id)}
              onChange={(e) => handleCheckboxChange(currentVehicleId, circumstance.id, e.target.checked)}
            />
            <label
              htmlFor={`circumstance-${currentVehicleId}-${circumstance.id}`}
              className="ml-3 text-sm font-medium text-gray-900 cursor-pointer flex items-center"
            >
              <div className="flex-shrink-0 w-12 h-12 mr-3 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-lg font-bold">{circumstance.code}</span>
              </div>
              <span>{circumstance.label}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Récapitulatif des circonstances</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-sm mb-1">Véhicule A</h5>
            {vehicleACircumstances.filter((c: Circumstance) => c.selected).length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {vehicleACircumstances
                  .filter((c: Circumstance) => c.selected)
                  .map((c: Circumstance) => (
                    <li key={c.id} className="mb-1">
                      {c.label}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Aucune circonstance sélectionnée</p>
            )}
          </div>
          <div>
            <h5 className="font-medium text-sm mb-1">Véhicule B</h5>
            {vehicleBCircumstances.filter((c: Circumstance) => c.selected).length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {vehicleBCircumstances
                  .filter((c: Circumstance) => c.selected)
                  .map((c: Circumstance) => (
                    <li key={c.id} className="mb-1">
                      {c.label}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Aucune circonstance sélectionnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircumstancesStep;
