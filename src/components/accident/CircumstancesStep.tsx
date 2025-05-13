import React from 'react';
import { Circumstance } from './types';

export interface CircumstancesStepProps {
  vehicleACircumstances: Circumstance[];
  vehicleBCircumstances: Circumstance[];
  handleCircumstanceChange: (vehicleId: string, circumstance: Circumstance, checked: boolean) => void;
  currentVehicleId: string;
  setCurrentVehicleId?: (id: string) => void;
}

const CircumstancesStep: React.FC<CircumstancesStepProps> = ({
  vehicleACircumstances,
  vehicleBCircumstances,
  handleCircumstanceChange,
  currentVehicleId,
  setCurrentVehicleId
}) => {
  // List of all possible circumstances
  const circumstances: Circumstance[] = [
    { id: "1", text: "En stationnement", label: "1", image: "/circumstances/1.svg" },
    { id: "2", text: "Quittait un stationnement", label: "2", image: "/circumstances/2.svg" },
    { id: "3", text: "Prenait un stationnement", label: "3", image: "/circumstances/3.svg" },
    { id: "4", text: "Sortait d'un parking, d'un lieu privé, d'un chemin de terre", label: "4", image: "/circumstances/4.svg" },
    { id: "5", text: "S'engageait dans un parking, un lieu privé, un chemin de terre", label: "5", image: "/circumstances/5.svg" },
    { id: "6", text: "S'engageait sur une place à sens giratoire", label: "6", image: "/circumstances/6.svg" },
    { id: "7", text: "Roulait sur une place à sens giratoire", label: "7", image: "/circumstances/7.svg" },
    { id: "8", text: "Heurtait à l'arrière, en roulant dans le même sens et sur une même file", label: "8", image: "/circumstances/8.svg" },
    { id: "9", text: "Roulait dans le même sens et sur une file différente", label: "9", image: "/circumstances/9.svg" },
    { id: "10", text: "Changeait de file", label: "10", image: "/circumstances/10.svg" },
    { id: "11", text: "Doublait", label: "11", image: "/circumstances/11.svg" },
    { id: "12", text: "Virait à droite", label: "12", image: "/circumstances/12.svg" },
    { id: "13", text: "Virait à gauche", label: "13", image: "/circumstances/13.svg" },
    { id: "14", text: "Reculait", label: "14", image: "/circumstances/14.svg" },
    { id: "15", text: "Empiétait sur une voie réservée à la circulation en sens inverse", label: "15", image: "/circumstances/15.svg" },
    { id: "16", text: "Venait de droite (dans un carrefour)", label: "16", image: "/circumstances/16.svg" },
    { id: "17", text: "N'avait pas observé un signal de priorité ou un feu rouge", label: "17", image: "/circumstances/17.svg" },
  ];

  // Check if a circumstance is selected for a vehicle
  const isCircumstanceSelected = (vehicleId: string, circumstanceId: string) => {
    if (vehicleId === "A") {
      return vehicleACircumstances.some(c => c.id === circumstanceId);
    } else {
      return vehicleBCircumstances.some(c => c.id === circumstanceId);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (vehicleId: string, circumstance: Circumstance, checked: boolean) => {
    handleCircumstanceChange(vehicleId, circumstance, checked);
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
              onChange={(e) => handleCheckboxChange(currentVehicleId, circumstance, e.target.checked)}
            />
            <label
              htmlFor={`circumstance-${currentVehicleId}-${circumstance.id}`}
              className="ml-3 text-sm font-medium text-gray-900 cursor-pointer flex items-center"
            >
              <div className="flex-shrink-0 w-12 h-12 mr-3 bg-gray-100 rounded flex items-center justify-center">
                {circumstance.image ? (
                  <img
                    src={circumstance.image}
                    alt={circumstance.text}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold">{circumstance.label}</span>
                )}
              </div>
              <span>{circumstance.text}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Récapitulatif des circonstances</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-sm mb-1">Véhicule A</h5>
            {vehicleACircumstances.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {vehicleACircumstances.map((c) => (
                  <li key={c.id} className="mb-1">
                    {c.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Aucune circonstance sélectionnée</p>
            )}
          </div>
          <div>
            <h5 className="font-medium text-sm mb-1">Véhicule B</h5>
            {vehicleBCircumstances.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {vehicleBCircumstances.map((c) => (
                  <li key={c.id} className="mb-1">
                    {c.text}
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
