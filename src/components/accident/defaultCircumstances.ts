
import { Circumstance } from './types';

export const DEFAULT_CIRCUMSTANCES: Circumstance[] = [
  { id: '1', code: '1', label: 'En stationnement', selected: false },
  { id: '2', code: '2', label: 'Quittait un stationnement', selected: false },
  { id: '3', code: '3', label: 'Prenait un stationnement', selected: false },
  { id: '4', code: '4', label: 'Sortait d\'un parking, d\'un lieu privé, d\'un chemin de terre', selected: false },
  { id: '5', code: '5', label: 'S\'engageait dans un parking, un lieu privé, un chemin de terre', selected: false },
  { id: '6', code: '6', label: 'S\'engageait sur une place à sens giratoire', selected: false },
  { id: '7', code: '7', label: 'Roulait sur une place à sens giratoire', selected: false },
  { id: '8', code: '8', label: 'Heurtait à l\'arrière, en roulant dans le même sens et sur une même file', selected: false },
  { id: '9', code: '9', label: 'Roulait dans le même sens et sur une file différente', selected: false },
  { id: '10', code: '10', label: 'Changeait de file', selected: false },
  { id: '11', code: '11', label: 'Doublait', selected: false },
  { id: '12', code: '12', label: 'Virait à droite', selected: false },
  { id: '13', code: '13', label: 'Virait à gauche', selected: false },
  { id: '14', code: '14', label: 'Reculait', selected: false },
  { id: '15', code: '15', label: 'Empiétait sur une voie réservée à la circulation en sens inverse', selected: false },
  { id: '16', code: '16', label: 'Venait de droite (dans un carrefour)', selected: false },
  { id: '17', code: '17', label: 'N\'avait pas observé un signal de priorité ou un feu rouge', selected: false },
];
